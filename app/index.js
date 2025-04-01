const { chromium } = require('playwright');
const fs = require('fs'); // Importamos el módulo fs


const PAIS = "ES"; // Cambia esto por el país que desees
// Puedes cambiar el país a otro que quieras, por ejemplo: "CO" para Colombia, "AR" para Argentina, etc.
let PALABRAS_CLAVE = "Coches de segunda mano"; // Cambia esto por la palabra clave que desees buscar
// Puedes cambiar la palabra clave a otra que quieras, por ejemplo: "Coches nuevos", "Móviles", etc.

(async () => {
    // Inicia el navegador
    const browser = await chromium.launch({ headless: false }); // headless: true significa sin interfaz gráfica
    const page = await browser.newPage();

    // Navega a la página que deseas scrapear

    PALABRAS_CLAVE = PALABRAS_CLAVE.replace(/ /g, '%20');

    await page.goto(`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${PAIS}&media_type=all&q=${PALABRAS_CLAVE}&search_type=keyword_unordered`);

    // Extrae el título de la página
    const pageTitle = await page.title();
    console.log(`Título de la página: ${pageTitle}`);

    // Espramos a que esté el elemento .x1dr75xp
    await page.waitForTimeout(1000);

    // Scrolls 5 veces
    let scroll = 50;
    while (scroll > 0) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(1500);
        scroll--;
        console.log("Scroll", scroll);
    }

    await page.waitForSelector('.x1dr75xp');
    console.log("Scraping ....");

    const ads = await page.evaluate(() => {
        let ads = [];
        const elements = document.querySelectorAll('.xh8yej3');

        elements.forEach(element => {
            const aPadre = element.querySelector('a');
            if (!aPadre) {
                return;
            }

            const span = aPadre.querySelector('.x8t9es0');
            if (span) {
                const title = span.textContent;
                const enlace = aPadre.href;
                if (title.trim() !== '') {
                    ads.push({ title, enlace });
                }
            }
        });

        const adsUnique = ads.filter((ad, index, self) =>
            index === self.findIndex((t) => (
                t.title === ad.title
            ))
        );

        ads = adsUnique.filter(ad => ad.title !== 'Iniciar sesión' && ad.title !== 'Registrarte');

        console.log("Ads", ads.length);
        console.log("Ads varios", ads);

        return ads;
    });

    console.log("End Scraping .... ads", ads.length);
    console.log("Scraping .... emails and web");

    const Datos = [];
    for (const ad of ads) {
        let Data = {
            title: ad.title,
            enlace: ad.enlace,
            phone: false,
            email: false,
            web: false
        }

        await page.goto(ad.enlace);
        await page.waitForTimeout(5000);

        const element = await page.$('.xieb3on');
        if (!element) {
            continue;
        }

        const spans = await element.$$('.x193iq5w .xeuugli .x13faqbe');
        const enlaces = await element.$$('a[target="_blank"]');


        for (const enlace of enlaces) {
            const href = await enlace.getAttribute('href');
            if (href.includes('http')) {
                Data.web = await enlace.innerText();
                break;
            }
        }

        let elementEncontrado = false;
        for (const span of spans) {
            if (elementEncontrado) {
                break;
            }
            const text = await span.innerHTML();
            if (text.includes('@')) {
                const textArray = text.split(' ');
                for (const text of textArray) {
                    if (text.includes('@')) {
                        Data.email = text
                        elementEncontrado = true;
                        break;
                    }
                }
            }

            if (text.includes('+')) {
                Data.phone = text;
                Data.phone = Data.phone.replace(/\D/g, '');
                elementEncontrado = true;
                break;
            }
        }
        console.log(Data);
        Datos.push(Data);
    }

    // Guardar datos en CSV
    const csvHeader = 'Title,Enlace,Emails,Phone,Web\n';
    const csvRows = Datos.map(data => {
        return `"${data.title}","${data.enlace}","${data.email}","${data.phone}","${data.web}"`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    fs.writeFileSync('resultados150.csv', csvContent, 'utf8');
    console.log('Datos guardados en resultados.csv');

    await browser.close();
})();
