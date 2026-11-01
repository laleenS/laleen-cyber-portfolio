from playwright.sync_api import sync_playwright
import os
import json

BASE = os.environ.get('GARDEN_TEST_URL', 'http://127.0.0.1:5173')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':1000})
    errors=[]
    page.on('pageerror', lambda e:errors.append(str(e)))
    page.goto(BASE)
    page.wait_for_selector('.evidence-slip')
    assert page.get_by_role('button',name='Escalate for investigation',exact=True).is_disabled()
    page.locator('#lens-toggle').click()
    assert page.locator('#garden-world').evaluate('(e)=>e.classList.contains("system-view")')
    before=page.locator('.garden-art').evaluate('(e)=>e.style.transform')
    page.mouse.move(1000,400);page.wait_for_timeout(350)
    assert page.locator('.garden-art').evaluate('(e)=>e.style.transform') != before
    page.locator('#motion-toggle').click()
    assert page.locator('.garden-art').evaluate('(e)=>e.style.transform') == ''
    page.locator('#motion-toggle').click()
    page.locator('#living-lab').scroll_into_view_if_needed()
    page.locator('#garden-world:not(.motion-running)').wait_for(state='attached')
    for evidence in ['auth','change','process']:
        page.locator('[data-evidence="'+evidence+'"]').click()
        page.locator('#pin-evidence').click()
    assert 'plausible explanation' in page.locator('#connection-reasoning').inner_text()
    assert page.locator('#evidence-pins button').count()==3
    page.locator('#analyst-reason').fill('Verify the maintenance owner, source inventory and script hash.')
    page.locator('[data-verdict="verify"]').click()
    assert 'verify maintenance first' in page.locator('#verdict-result').inner_text()
    page.locator('#challenge-assistant').click()
    assert 'dual-use' in page.locator('#assistant-correction').inner_text()
    page.locator('[data-verdict="close"]').click()
    assert 'premature' in page.locator('#verdict-result').inner_text()
    # Pointer-independent tabs follow ARIA keyboard behavior.
    page.locator('#tab-soc').focus();page.keyboard.press('ArrowRight')
    assert page.locator('#tab-iam').get_attribute('aria-selected')=='true'
    assert page.locator('#tab-iam').evaluate('(e)=>document.activeElement===e')
    page.locator('#identity').select_option('leaver')
    assert page.locator('.permission-door.permitted').count()==2
    page.locator('#access-rationale').fill('Employment ended; remove interactive access and verify downstream tokens.')
    page.locator('#review-access').click()
    assert page.locator('.permission-door.permitted').count()==0
    page.locator('#identity').select_option('employee')
    page.locator('#access-rationale').fill('Review a proposed time-bound exception with an independent owner.')
    page.locator('#access-exception').click()
    assert 'unchanged until approved' in page.locator('#access-result').inner_text()
    page.locator('#identity').select_option('contractor')
    page.locator('#access-rationale').fill('Expired contract needs an approved lifecycle review.')
    page.locator('#access-exception').click()
    assert 'refused' in page.locator('#access-result').inner_text()
    page.locator('#identity').select_option('employee')
    page.locator('#role-move').check()
    assert 'persist' in page.locator('#access-result').inner_text()
    page.locator('#access-rationale').fill('Read-only role needs archive access without administration.')
    page.locator('#review-access').click()
    assert page.locator('.permission-door.permitted').count()==1
    page.locator('#session-expired').check()
    page.locator('.permission-door').first.get_by_role('button').click()
    assert 'Session expired' in page.locator('#access-result').inner_text()
    page.locator('#tab-baseline').click()
    page.locator('#run-baseline').click()
    assert '0 of 4' in page.locator('#baseline-results').inner_text()
    page.locator('#config-firewall').check()
    for id in ['rootLogin','passwordAuth','worldWrite']:page.locator('#config-'+id).uncheck()
    page.locator('#run-baseline').click()
    assert '4 of 4' in page.locator('#baseline-results').inner_text()
    page.locator('[data-open-drawer="packet"]').first.click()
    for name in ['Begin journey','Next checkpoint','Next checkpoint','Next checkpoint']:
        page.locator('#drawer-content').get_by_role('button',name=name,exact=False).click()
    assert 'Session expired' in page.locator('#drawer-content').inner_text()
    page.keyboard.press('Escape')
    page.locator('[data-open-drawer="integrity"]').click()
    page.get_by_role('button',name='Compare fingerprint').click()
    page.locator('#drawer-content').get_by_text('MATCH · Contents equal',exact=False).wait_for()
    page.get_by_role('button',name='Tamper with the sample').click()
    page.get_by_role('button',name='Compare fingerprint').click()
    page.locator('#drawer-content').get_by_text('MISMATCH · Same label',exact=False).wait_for()
    page.keyboard.press('Escape')
    page.locator('#honeytoken').click();assert 'stays in this page' in page.locator('#honey-result').inner_text()
    page.locator('.secret summary').click();page.locator('#cipher').fill('root');page.locator('#cipher').press('Enter')
    page.locator('#command').fill('cat seed.txt');page.locator('#command').press('Enter')
    page.locator('#open-craft').click();assert 'time-based' in page.locator('#drawer-content').inner_text()
    page.keyboard.press('Shift+Tab')
    assert page.locator('#drawer-dialog').evaluate('(e)=>e.contains(document.activeElement)')
    page.keyboard.press('Escape')
    page.locator('#open-guide').click()
    page.locator('[data-question="What has Laleen actually built?"]').click()
    assert 'remain in progress' in page.locator('#guide-log').inner_text()
    assert page.locator('.guide-citations a').count()>0
    page.locator('#guide-question').fill('<img src=x onerror=alert(1)>');page.locator('#guide-form').get_by_role('button').click()
    assert page.locator('#guide-log img').count()==0
    page.keyboard.press('Escape')
    assert page.locator('#open-guide').evaluate('(e)=>e===document.activeElement')
    page.locator('#dock-journal').click()
    assert page.locator('.discovery-list .found').count()==11
    page.keyboard.press('Escape')
    page.reload();assert page.locator('#discovery-count').inner_text()=='11'
    page.locator('#dock-journal').click()
    page.get_by_role('button',name='Reset this journal',exact=True).click()
    page.get_by_role('button',name='Keep my journal',exact=True).click()
    assert page.locator('.discovery-list .found').count()==11
    page.get_by_role('button',name='Reset this journal',exact=True).click()
    page.get_by_role('button',name='Yes, clear my discoveries',exact=True).click()
    assert page.locator('.discovery-list .found').count()==0
    page.keyboard.press('Escape')
    page.emulate_media(reduced_motion='reduce')
    page.locator('#home').scroll_into_view_if_needed()
    assert page.locator('#motion-toggle').is_disabled()
    assert page.locator('.garden-atmosphere').evaluate('(e)=>getComputedStyle(e).display')=='none'
    for w in [375,390,430,768,1024,1366,1920]:
        page.set_viewport_size({'width':w,'height':900});page.goto(BASE);page.wait_for_selector('.evidence-slip')
        for station in ['soc','iam','baseline']:
            page.locator('#tab-'+station).click()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow {w} {station}'
            panel=page.locator('#panel-'+station)
            assert panel.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),f'panel overflow {w} {station}'
        page.screenshot(path=f'/tmp/garden-v2-{w}.png',full_page=True)
        print(f'{w}px all stations: no page or panel overflow')
    page.locator('#open-map').click()
    page.locator('.garden-map').get_by_role('link',name='Résumé',exact=False).click()
    assert page.locator('#resume').get_attribute('open') is not None
    assert not errors,errors
    # Storage restrictions must not prevent any other feature from initializing.
    context=browser.new_context()
    context.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('storage denied')}})")
    restricted=context.new_page();restricted.goto(BASE);restricted.wait_for_selector('.evidence-slip');restricted.locator('#lens-toggle').click();restricted.locator('#dock-journal').click()
    assert 'storage is unavailable' in restricted.locator('#drawer-content').inner_text()
    context.close()
    # Without JavaScript the narrative and project summaries remain available.
    context=browser.new_context(java_script_enabled=False)
    basic=context.new_page();basic.goto(BASE)
    assert 'SOC Investigation Lab' in basic.locator('noscript').inner_text()
    assert basic.locator('#about').is_visible()
    context.close()
    # Optional AI UI: consent is explicit; responses remain safe text with citations.
    ai_context=browser.new_context()
    ai=ai_context.new_page()
    ai.route('**/api/guide/status',lambda route:route.fulfill(json={'enabled':True}))
    calls=[]
    def answer(route):
        calls.append(route.request.post_data)
        route.fulfill(json={'answer':'<img src=x onerror=alert(1)> Student labs remain in progress.','sources':['soc']})
    ai.route('**/api/guide',answer)
    ai.goto(BASE);ai.locator('#open-guide').click()
    ai.get_by_role('button',name='What’s actually built?',exact=True).click()
    assert not calls
    ai.get_by_role('button',name='Enable AI mode',exact=True).click()
    ai.locator('#guide-question').fill('Is the SOC lab finished?');ai.locator('#guide-form').get_by_role('button').click()
    ai.locator('#guide-log').get_by_text('AI-generated',exact=False).wait_for()
    assert len(calls)==1
    assert ai.locator('#guide-log img').count()==0
    assert ai.locator('.guide-citations a').last.get_attribute('href')=='#soc'
    ai.unroute('**/api/guide',answer)
    ai.route('**/api/guide',lambda route:route.fulfill(status=503,json={'error':'Unavailable'}))
    ai.locator('#guide-question').fill('What is complete?');ai.locator('#guide-form').get_by_role('button').click()
    ai.locator('#guide-log').get_by_text('LOCAL FALLBACK',exact=False).wait_for()
    ai_context.close()
    assert not errors,errors
    print('Optional AI UI consent, cited safe-text answer, and unavailable-provider fallback passed with mocked responses.')
    print('Investigation, access lifecycle, baseline, packet, integrity, all 11 discoveries, reset/persistence, local guide, safe text, keyboard tabs, reduced motion, storage-denied and no-JS fallback passed.')
    browser.close()
