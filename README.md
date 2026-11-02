# Hemwebbläsare – egen tunnel ut på internet

`index.html` är bara en startsida. Själva tunneln är Chromium på din hemserver,
nåbar över HTTPS via Cloudflare Tunnel. Surfa **inne i** den webbläsaren, inte
i startsidans ram, så utgår trafiken från ditt hemnät.

```
[Kaféets dator] --HTTPS--> Cloudflare --tunnel--> [Hemserver: Chromium] --> internet
```

Tunneln är utgående från hemservern, så inga portar öppnas hemma. Den fungerar
bara om kaféets filter inte blockerar din egen domän.

## Krav
- Hemserver med Docker och Docker Compose
- Gratis Cloudflare-konto och en domän hos Cloudflare

## Uppsättning
1. Kopiera `.env.example` till `.env` och fyll i användarnamn och ett långt lösenord.
2. Cloudflare Zero Trust → Networks → Tunnels → skapa tunnel → kopiera **token** till `CLOUDFLARE_TUNNEL_TOKEN`.
3. Lägg till en *Public hostname*, till exempel `surf.dindomän.se`, med tjänsten `https://browser:3001`.
   Slå på **No TLS Verify** under Additional settings → TLS (självsignerat certifikat).
4. Starta: `docker compose up -d`
5. Öppna `https://surf.dindomän.se` direkt (inte via ramen om den blockeras), logga in och skriv sedan in till exempel `facebook.com` i Chromium.

## Skydd
- Lägg en **Cloudflare Access**-policy (gratis) framför hostnamnet.
- Committa aldrig `.env`. Använd ett långt lösenord.
- Uppdatera: `docker compose pull && docker compose up -d`
