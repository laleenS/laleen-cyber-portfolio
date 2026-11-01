from playwright.sync_api import sync_playwright, expect
import os

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000})
    errors=[]; failures=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda message:errors.append(message.text) if message.type=='error' else None)
    page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
    page.goto('http://127.0.0.1:5173/')
    page.wait_for_selector('.evidence-slip')
    page.evaluate('document.fonts.ready')
    assert page.evaluate("document.fonts.check('16px \"Garden Oldstyle\"')")
    assert page.evaluate("document.fonts.check('16px \"Garden Humanist\"')")
    page.locator('#theme-toggle').click()
    assert page.locator('html').get_attribute('data-theme')=='golden'
    assert page.locator('#theme-toggle').get_attribute('aria-pressed')=='true'
    assert page.locator('.golden-art').is_visible()
    assert not page.locator('.garden-art').is_visible()
    page.reload();assert page.locator('html').get_attribute('data-theme')=='golden'
    page.screenshot(path='/tmp/root-access-golden-desktop.png')
    for w in [375,390,430,768,1024,1366,1920]:
        page.set_viewport_size({'width':w,'height':900})
        for theme in ['golden','moonlit']:
            if page.locator('html').get_attribute('data-theme')!=theme:page.locator('#theme-toggle').click()
            for station in ['soc','iam','baseline']:
                page.locator('#tab-'+station).click()
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'page overflow {w} {theme} {station}'
                assert page.locator('#panel-'+station).evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),f'panel overflow {w} {theme} {station}'
        print(f'{w}px: both lights and all three teaching stations fit')
    page.set_viewport_size({'width':1440,'height':1000})
    page.locator('#home').scroll_into_view_if_needed()
    page.locator('#garden-world.motion-running').wait_for(state='attached')
    page.locator('#dock-station').click();page.wait_for_selector('#field-station[open]')
    page.locator('#garden-world:not(.motion-running)').wait_for(state='attached')
    assert page.locator('.station-galaxy circle').count()==160
    # Keyboard window movement and recentering have the same function as dragging.
    handle=page.locator('#station-window-name');handle.focus()
    before=page.locator('.station-window').bounding_box();page.keyboard.press('ArrowRight')
    after=page.locator('.station-window').bounding_box();assert after['x']>before['x']
    page.keyboard.press('Home');assert page.locator('.station-window').evaluate('(e)=>e.style.left')==''
    # Drag remains inside the workspace.
    box=handle.bounding_box();page.mouse.move(box['x']+30,box['y']+20);page.mouse.down();page.mouse.move(1400,900,steps=5);page.mouse.up()
    area=page.locator('.station-workspace').bounding_box();window=page.locator('.station-window').bounding_box()
    assert window['x']>=area['x'] and window['x']+window['width']<=area['x']+area['width']+1
    page.get_by_role('button',name='Recenter',exact=True).click()
    page.locator('#station-maximize').click();assert page.locator('#station-maximize').get_attribute('aria-pressed')=='true'
    page.locator('#station-maximize').click()
    page.get_by_role('button',name='Minimize',exact=True).click();assert page.locator('.station-window').is_hidden()
    page.locator('#station-restore').click();assert page.locator('.station-window').is_visible()
    page.locator('[data-station-app="contact"]').click();assert page.locator('#station-window-content a').first.get_attribute('href')=='https://github.com/laleenS'
    page.locator('[data-station-app="console"]').click();page.locator('#station-command').fill('<img src=x onerror=alert(1)>');page.locator('#station-command').press('Enter');assert page.locator('#station-console-log img').count()==0
    page.locator('#station-command').fill('help');page.locator('#station-command').press('Enter');assert 'open soc' in page.locator('#station-console-log').inner_text()
    page.locator('#station-theme').click();assert page.locator('html').get_attribute('data-theme')=='golden'
    page.locator('#station-wallpaper-toggle').click();assert page.locator('#field-station').evaluate('(e)=>e.classList.contains("wallpaper-paused")')
    page.locator('[data-station-app="files"]').click();page.screenshot(path='/tmp/root-access-field-station.png')
    page.locator('.station-file').first.click();expect(page.locator('#case-dialog')).to_be_visible();assert page.locator('#field-station').is_hidden()
    page.keyboard.press('Escape')
    for w in [375,390,430,768,1366]:
        page.set_viewport_size({'width':w,'height':900});page.locator('#dock-station').click()
        for app in ['files','about','console','contact']:
            page.locator('[data-station-app="'+app+'"]').click()
            assert page.locator('#field-station').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),f'field station overflow {w} {app}'
            assert page.locator('#station-window-content').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),f'window overflow {w} {app}'
        page.keyboard.press('Escape');expect(page.locator('#dock-station')).to_be_focused()
    page.set_viewport_size({'width':390,'height':844});page.goto('http://127.0.0.1:5173/');page.evaluate('document.fonts.ready');page.screenshot(path='/tmp/root-access-golden-mobile.png')
    page.emulate_media(reduced_motion='reduce');page.locator('#dock-station').click();assert page.locator('#station-wallpaper-toggle').is_disabled()
    assert page.locator('.galaxy-spiral').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
    page.keyboard.press('Escape')
    assert not errors,errors
    assert not failures,failures
    ctx=browser.new_context();ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('denied')}})")
    denied=ctx.new_page();denied.goto('http://127.0.0.1:5173/');denied.locator('#theme-toggle').click();assert denied.locator('html').get_attribute('data-theme')=='golden';ctx.close()
    print('Fonts loaded; theme persistence/storage-denial, pointer and keyboard window movement, bounds, expand/minimize/restore, app links, safe console, in-scene theme, reduced motion and modal focus passed. No page or HTTP errors.')
    browser.close()
