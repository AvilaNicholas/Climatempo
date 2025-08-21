async function consultarCEP() {
    const cep = document.getElementById('cep').value.trim();
    const resultado = document.getElementById('resultado');

    // Validação do CEP
    if (!/^\d{8}$/.test(cep)) {
        alert("CEP inválido! Digite exatamente 8 números.");
        return;
    }

    try {
        // Consulta ViaCEP
        const viacepResp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const viadata = await viacepResp.json();
        console.log("Infos Cep", viadata);

        if (viadata.erro) {
            resultado.innerHTML = "CEP não encontrado.";
            return;
        }

        const endereco = `${viadata.cep}, ${viadata.localidade},${viadata.uf}`;
        console.log("Endereço gerado:", endereco);

        // Consulta OpenStreetMap - Lat e Log
        const urlmap = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
        const geoResp = await fetch(urlmap);
        console.log("URL Gerada teste:", geoResp);
        const geoData = await geoResp.json();
        console.log("Infos OpenStreet", geoData);

        if (!geoData || geoData.length === 0) {
            resultado.innerHTML = "Coordenadas não encontradas para o endereço.";
            return;
        }

        const { lat, lon } = geoData[0];

        // Exibe endereço e coordenadas
        resultado.innerHTML = `
                    <h2><i class="fas fa-map-pin"></i> Infos de seu local</h2>
                    <p><strong>Endereço:</strong> ${viadata.logradouro};</p>
                    <p><strong>CEP:</strong> ${viadata.cep};</p>
                    <p><strong>Bairro:</strong> ${viadata.bairro};</p>
                    <p><strong>Cidade:</strong> ${viadata.localidade};</p>
                    <p><strong>Latitude:</strong> ${lat};</p>
                    <p><strong>Longitude:</strong> ${lon};</p>
                `;

        // Consulta Open-Meteo - API De Temperatura
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const climaResp = await fetch(url);
        if (!climaResp.ok) throw new Error('Erro na requisição da previsão do tempo');

        const climaData = await climaResp.json();
        const weather = climaData.current_weather;

        resultado.innerHTML += `
                    <p><strong>Temperatura:</strong> ${weather.temperature} °C;</p>
                    <p><strong>Velocidade do vento:</strong> ${weather.windspeed} km/h;</p>
                    <p><strong>Direção do vento:</strong> ${weather.winddirection}°.</p>
                `;

        console.log("Dados do clima:", climaData);

    } catch (error) {
        console.error("Erro na consulta:", error);
        resultado.innerHTML = "Ocorreu um erro ao consultar o CEP, as coordenadas ou o clima.";
    }
}