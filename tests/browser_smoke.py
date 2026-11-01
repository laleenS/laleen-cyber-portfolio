from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 page=browser.new_page();errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 for w in [375,390,430,768,1366,1920]:
  page.set_viewport_size({'width':w,'height':900});page.goto('http://127.0.0.1:5173/')
  page.wait_for_selector('.project')
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),f'overflow {w}'
  assert page.locator('.garden-art').evaluate('(e)=>e.complete && e.naturalWidth > 0')
  for name in ['SOC Investigation Lab','IAM Access Review','Security Baseline Checker']:
   page.get_by_role('button',name='Open '+name+' case file').click()
   assert page.locator('#case-dialog').evaluate('(e)=>e.open')
   assert page.locator('#case-title').inner_text()==name
   page.keyboard.press('Escape');assert not page.locator('#case-dialog').evaluate('(e)=>e.open')
  page.screenshot(path=f'/tmp/garden-{w}.png',full_page=True)
  print(f'{w}px: no overflow, artwork loads, all case files open and close')
 page.set_viewport_size({'width':1366,'height':900})
 page.locator('#command').fill('help');page.locator('#command').press('Enter');assert 'open soc' in page.locator('#terminal-output').inner_text()
 page.locator('#command').fill('<img src=x onerror=alert(1)>');page.locator('#command').press('Enter');assert page.locator('#terminal-output img').count()==0
 page.locator('#command').fill('open soc');page.locator('#command').press('Enter');page.keyboard.press('Escape');assert page.locator('#command').evaluate('(e)=>e===document.activeElement')
 page.locator('.secret summary').click();page.locator('#cipher').fill('root');page.locator('#cipher').press('Enter');assert 'granted' in page.locator('#cipher-result').inner_text()
 assert page.locator('#sound').get_attribute('aria-pressed')=='false'
 page.locator('#sound').click();assert page.locator('#sound').get_attribute('aria-pressed')=='true';page.locator('#sound').click()
 page.emulate_media(reduced_motion='reduce');assert page.locator('.firefly').evaluate('(e)=>getComputedStyle(e).display')=='none'
 page.goto('http://127.0.0.1:5173/');page.keyboard.press('Tab');assert page.locator('.skip').evaluate('(e)=>e===document.activeElement')
 page.get_by_role('link',name='The gardener',exact=True).click();assert page.evaluate('location.hash')=='#about'
 for a in page.locator('a[href^="#"]').all():
  target=a.get_attribute('href')[1:];assert page.locator('[id="'+target+'"]').count(),target
 page.locator('.garden-world').hover();page.mouse.move(900,400)
 assert not errors,errors
 print('Terminal allowlist and injection text, cipher, sound toggle, reduced motion, focus restoration, skip link, anchors: passed. No JS errors.')
 browser.close()
