"""Build licensed, renamed Latin WOFF2 subsets from locally supplied Google Fonts originals.
Usage: python3 tools/subset-fonts.py /path/to/original-fonts
Requires fonttools and brotli in the tooling environment, not in the website.
"""
from pathlib import Path
import sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont

source = Path(sys.argv[1])
destination = Path(__file__).resolve().parents[1] / 'assets' / 'fonts'
for filename, output, family, style, weight in [
    ('LindenHill-Regular.ttf', 'garden-oldstyle-regular.woff2', 'Garden Oldstyle', 'Regular', None),
    ('LindenHill-Italic.ttf', 'garden-oldstyle-italic.woff2', 'Garden Oldstyle', 'Italic', None),
    ('Commissioner.ttf', 'garden-humanist.woff2', 'Garden Humanist', 'Regular', 400),
    ('Commissioner.ttf', 'garden-humanist-semibold.woff2', 'Garden Humanist', 'SemiBold', 600),
]:
    font = TTFont(source / filename)
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'FLAR': 0, 'VOLM': 0, 'slnt': 0, 'wght': weight}, inplace=True)
    options = subset.Options()
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=list(range(0x20, 0x100)) + list(range(0x2000, 0x2070)) + list(range(0x2190, 0x2200)))
    sub.subset(font)
    names = {1: family, 2: style, 4: family + ' ' + style, 6: family.replace(' ', '') + '-' + style, 16: family, 17: style}
    for record in font['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding(), errors='replace')
    font.flavor = 'woff2'
    font.save(destination / output)
    print(output, (destination / output).stat().st_size, 'bytes')
