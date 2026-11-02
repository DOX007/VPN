# WireGuard VPN – gratis molnserver

Det här repot sätter upp en riktig WireGuard-VPN på en Ubuntu-VM i Oracle Cloud
Always Free. VPN-servern står i molnet; WireGuard-appen på din dator skapar den
krypterade nätverkstunneln. När tunneln är aktiv går IPv4-trafik från datorn ut
via VM:en. Det här är inte en webbläsarproxy.

## Viktiga krav och begränsningar

- Oracle Always Free-kapacitet kan saknas i vissa regioner. Kontoregistrering
  kan kräva betalningskort; användningen måste stanna inom Always Free-gränser.
- WireGuard kräver inkommande UDP `51820` på VM:ens publika IP. Brandväggen i
  molnkontot och kafénätet måste tillåta UDP-porten. Om kafénätet blockerar UDP
  fungerar inte den här lösningen där.
- Installera den officiella WireGuard-klienten på enheten. En webbsida kan inte
  skapa en VPN-tunnel för hela enheten.
- Konfigurationen routar IPv4. Den garanterar inte att IPv6-trafik går genom
  tunneln; aktivera klientens kill switch/blockering av trafik utanför tunneln
  om den finns.
- Detta är en personlig VPN-server, inte en anonymiseringstjänst. Webbplatser
  ser VM:ens publika IP, och molnleverantören driver servern.

## Skapa VM och konfigurera nätet

1. Skapa ett Oracle Cloud-konto och välj en region med tillgänglig
   **Always Free**-kapacitet.
2. Skapa en Ubuntu 24.04 VM. Välj endast en shape som OCI markerar
   **Always Free eligible**. Tilldela en publik IPv4-adress.
3. I VM:ens nätverk (Network Security Group och/eller subnet Security List),
   lägg till en inkommande regel:
   - Source: `0.0.0.0/0`
   - Protocol: UDP
   - Destination port: `51820`
4. I VM-skapandets **Advanced options → Cloud-init script**, klistra in hela
   innehållet från [`cloud-init.yaml`](cloud-init.yaml). Skapa VM:en och vänta
   tills cloud-init har slutförts.

## Hämta klientkonfigurationen

Cloud-init skapar `/root/wireguard-client.conf` med en unik privat nyckel.
Hämta filen säkert med SSH via OCI Console/Cloud Shell (eller en SSH-klient):

```sh
sudo cat /root/wireguard-client.conf
```

Importera konfigurationen i WireGuard-appen. Behandla filen som ett lösenord:
den ger åtkomst till VPN-servern. Dela eller committa den inte. För en andra
enhet ska en separat peer skapas; kopiera inte samma klientprofil till flera
enheter.

## Verifiera

1. Aktivera tunneln i WireGuard-appen.
2. Kontrollera i appen att en handskakning sker och att data skickas.
3. Besök en IP-kontrollsida. Den publika IPv4-adressen ska vara VM:ens IP,
   inte kafénätets.
4. Testa `temu.com`. Om VPN-handshake saknas, kontrollera UDP-regeln och att
   kafénätet tillåter UDP `51820`.

## Drift

På Ubuntu:

```sh
sudo wg show
sudo systemctl status wg-quick@wg0
```

Håll Ubuntu uppdaterat och skapa nya klientnycklar om en enhet tappas bort.
Cloud-init-installationen lagrar serverns privata nyckel i
`/etc/wireguard/wg0.conf` och klientens privata nyckel i
`/root/wireguard-client.conf`, båda root-skyddade.
