# Hemwebbläsare – egen tunnel ut på internet

Chromium körs på din hemserver och strömmas till valfri webbläsare över HTTPS
(port 443). Du installerar inget på datorn du sitter vid, och all trafik går ut
från ditt hemnät. Härifrån når du webbmail, hemdatorn och resten av internet.

```
[Kaféets dator] --HTTPS--> Cloudflare --tunnel--> [Hemserver: Chromium]
```

Tunneln är utgående från hemservern, så du behöver inte öppna några portar hemma.

## Krav
- Hemserver med Docker och Docker Compose
- Gratis Cloudflare-konto och en domän hos Cloudflare

## Uppsättning
1. Kopiera `.env.example` till `.env` och fyll i användarnamn och ett långt lösenord.
2. Cloudflare Zero Trust → Networks → Tunnels → skapa tunnel → kopiera **token** till `CLOUDFLARE_TUNNEL_TOKEN` i `.env`.
3. Lägg till en *Public hostname* i tunneln, till exempel `surf.dindomän.se`, med tjänsten `https://browser:3001`.
   Under *Additional settings* → TLS, slå på **No TLS Verify**, eftersom containern använder ett självsignerat certifikat.
4. Starta:
   ```
   docker compose up -d
   ```
5. Öppna `https://surf.dindomän.se` och logga in.

## Rekommenderat skydd
Lägg en **Cloudflare Access**-policy (gratis, upp till 50 användare) framför
hostnamnet, så att bara din e-postadress släpps in via engångskod. Då skyddas
tjänsten av två lås.

## Säkerhet
- Committa aldrig `.env`. Den ligger i `.gitignore`.
- Använd ett unikt, långt lösenord. Tjänsten ger tillgång till en inloggad webbläsare i ditt hemnät.
- Uppdatera regelbundet: `docker compose pull && docker compose up -d`.
- Webbläsarens profil sparas i `./config`. Logga ut från tjänster du inte vill ska ligga kvar.
