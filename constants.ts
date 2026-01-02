
import { PackageItem, GuideItem, ErrorItem, ScriptItem } from './types';

export const APP_VERSION = "1.0.0";

export const SCRIPTS: ScriptItem[] = [
  // ==========================
  // OSINT (Open Source Intelligence)
  // ==========================
  {
    id: 'ipgeolocation',
    name: 'IPGeoLocation',
    author: 'maldevel',
    description: 'Retrieve IP Geolocation information (Country, City, ISP, Lat/Long).',
    githubUrl: 'https://github.com/maldevel/IPGeoLocation',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/maldevel/IPGeoLocation && cd IPGeoLocation && pip install -r requirements.txt',
    previewOutput: `
 ______________________________________
|                                      |
|  IPGeoLocation - Tool                |
|  [!] Retrieve IP Geolocation info    |
|______________________________________|

 Target: 192.168.1.1
 [+] Country: United States
    `
  },
  {
    id: 'seeker',
    name: 'Seeker',
    author: 'thewhiteh4t',
    description: 'Accurately Locate Smartphones using Social Engineering (GPS).',
    githubUrl: 'https://github.com/thewhiteh4t/seeker',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/thewhiteh4t/seeker.git && cd seeker && ./install.sh',
    previewOutput: `
 .--.
|o_o |  Seeker - Location Tracker
|:_/ |  [+] Waiting for User Interaction...
//   \\ \\  [+] User Clicked the Link!
(|     | ) [!] Latitude  : 40.7128 N
/'\\_   _/\`\\ 
\\___)=(___/ 
    `
  },
  {
    id: 'redhawk',
    name: 'RED_HAWK',
    author: 'Tuhinshubhra',
    description: 'All-in-one tool for Information Gathering and Vulnerability Scanning.',
    githubUrl: 'https://github.com/Tuhinshubhra/RED_HAWK',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/Tuhinshubhra/RED_HAWK && cd RED_HAWK && php rhawk.php',
    previewOutput: `
  ______  ______  _____    _   _
 |  _ \\ \\|  ____||  __ \\  | | | |
 | |_) | | |__   | |  | | | |_| |
 |  _ <  |  __|  | |  | | |  _  |
 | |_) | | |____ | |__| | | | | |

 [+] Enter Website: google.com
 [+] Scanning...
`
  },
  {
    id: 'sherlock',
    name: 'Sherlock',
    author: 'sherlock-project',
    description: 'Hunt down social media accounts by username across social networks.',
    githubUrl: 'https://github.com/sherlock-project/sherlock',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/sherlock-project/sherlock && cd sherlock && python3 -m pip install -r requirements.txt',
    previewOutput: `
[*] Checking username: user123
[+] Instagram: https://instagram.com/user123
[+] Facebook: https://facebook.com/user123
[+] Twitter: https://twitter.com/user123
    `
  },
  {
    id: 'phoneinfoga',
    name: 'PhoneInfoga',
    author: 'sundowndev',
    description: 'Advanced information gathering framework for phone numbers.',
    githubUrl: 'https://github.com/sundowndev/phoneinfoga',
    category: 'OSINT',
    installCommand: 'pkg install phoneinfoga',
    previewOutput: `
    ____  __                      
   / __ \\/ /_  ____  ____  ___    
  / /_/ / __ \\/ __ \\/ __ \\/ _ \\   
 / ____/ / / / /_/ / / / /  __/   
/_/   /_/ /_/\\____/_/ /_/\\___/    

[+] Running scan on +15550123
[!] Location: USA
[!] Carrier: Verizon
`
  },
  {
    id: 'infoga',
    name: 'Infoga',
    author: 'm4ll0k',
    description: 'Email Information Gathering Tool.',
    githubUrl: 'https://github.com/m4ll0k/Infoga',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/m4ll0k/Infoga && cd Infoga && python setup.py install',
    previewOutput: `
 _       __                   
(_)___  / ____/____  ____ _____ 
/ / __ \\/ /_  / __ \\/ __ \`/ __ \\
/ / / / / __/ / /_/ / /_/ / /_/ /
/_/_/ /_/_/    \\____/\\__, /\\__,_/ 
                    /____/        

[+] Target: site.com
[+] Email found: admin@site.com
`
  },
  {
    id: 'breacher',
    name: 'Breacher',
    author: 's0md3v',
    description: 'An advanced tool to find admin panels.',
    githubUrl: 'https://github.com/s0md3v/Breacher',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/s0md3v/Breacher && cd Breacher && python breacher.py',
    previewOutput: `
  ____                  _               
 |  _ \\                | |              
 | |_) |_ __ ___  __ _ | |__   ___ _ __ 
 |  _ <| '__/ _ \\/ _\` || '_ \\ / _ \\ '__|
 | |_) | | |  __/ (_| || | | |  __/ |   
 |____/|_|  \\___|\\__,_||_| |_|\\___|_|   

 [+] Target: www.site.com
 [+] Admin Panel Found: /admin/login.php
`
  },
  {
    id: 'sublist3r',
    name: 'Sublist3r',
    author: 'aboul3la',
    description: 'Fast subdomains enumeration tool for penetration testers.',
    githubUrl: 'https://github.com/aboul3la/Sublist3r',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/aboul3la/Sublist3r && cd Sublist3r && pip install -r requirements.txt',
    previewOutput: `
  ____        _     _ _     _   _____
 / ___| _   _| |__ | (_)___| |_|___ / _ __
 \\___ \\| | | | '_ \\| | / __| __| |_ \\| '__|
  ___) | |_| | |_) | | \\__ \\ |_ ___) | |
 |____/ \\__,_|_.__/|_|_|___/\\__|____/|_|

[-] Enumerating subdomains...
[-] Found: mail.example.com
`
  },
  {
    id: 'th3inspector',
    name: 'Th3inspector',
    author: 'Moham3dRiahi',
    description: 'All in one Tool for Information Gathering.',
    githubUrl: 'https://github.com/Moham3dRiahi/Th3inspector',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/Moham3dRiahi/Th3inspector && cd Th3inspector && chmod +x install.sh && ./install.sh',
    previewOutput: `
 _____ _    _____ _                            _             
|_   _| |__|___ /(_)_ __  ___ _ __   ___  ___| |_ ___  _ __ 
  | | | '_ \\ |_ \\| | '_ \\/ __| '_ \\ / _ \\/ __| __/ _ \\| '__|
  | | | | | |__) | | | | \\__ \\ |_) |  __/ (__| || (_) | |   
  |_| |_| |_|____/|_|_| |_|___/ .__/ \\___|\\___|\\__\\___/|_|   
                              |_|                            
 [1] Website Info
 [2] Phone Number Info
`
  },
  {
    id: 'holehe',
    name: 'Holehe',
    author: 'megadose',
    description: 'Check if an email is attached to social media accounts (120+ sites).',
    githubUrl: 'https://github.com/megadose/holehe',
    category: 'OSINT',
    installCommand: 'pip install holehe',
    previewOutput: `
[+] email@gmail.com
[+] Instagram: Registered
[+] Twitter: Registered
[+] Spotify: Not Registered
`
  },
  {
    id: 'osintgram',
    name: 'Osintgram',
    author: 'Datalux',
    description: 'OSINT Tool on Instagram to collect, analyze, and run reconnaissance.',
    githubUrl: 'https://github.com/Datalux/Osintgram',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/Datalux/Osintgram && cd Osintgram && pip install -r requirements.txt',
    previewOutput: `
  ___       _       _                           
 / _ \\ ___ (_)_ __ | |_ __ _ _ __ __ _ _ __ ___ 
| | | / __|| | '_ \\| __/ _\` | '__/ _\` | '_ \` _ \\
| |_| \\__ \\| | | | | || (_| | | | (_| | | | | | |
 \\___/|___/|_|_| |_|\\__\\__,_|_|  \\__,_|_| |_| |_|

 > target_username
 [1] Get Followers
 [2] Get User Info
`
  },
  {
    id: 'ip-tracer',
    name: 'IP-Tracer',
    author: 'rajkumardusad',
    description: 'Track IP address location with map view support.',
    githubUrl: 'https://github.com/rajkumardusad/IP-Tracer',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/rajkumardusad/IP-Tracer && cd IP-Tracer && chmod +x install && ./install',
    previewOutput: `
  _____ _____    _____                       
 |_   _|  __ \\  |_   _|                      
   | | | |__) |___| |_ __ __ _  ___ ___ _ __ 
   | | |  ___/____| | '__/ _\` |/ __/ _ \\ '__|
  _| |_| |        | | | | (_| | (_|  __/ |   
 |_____|_|        |_|_|  \\__,_|\\___\\___|_|   

 [1] Track IP
 [2] Track My IP
`
  },
  {
    id: 'maigret',
    name: 'Maigret',
    author: 'soxoj',
    description: 'Collect a dossier on a person by username from thousands of sites (Sherlock fork).',
    githubUrl: 'https://github.com/soxoj/maigret',
    category: 'OSINT',
    installCommand: 'pip install maigret',
    previewOutput: `
    __  ___      _                __ 
   /  |/  /___ _(_)___ _________ / /_
  / /|_/ / __ \`/ / __ \`/ ___/ _ \\/ __/
 / /  / / /_/ / / /_/ / /  /  __/ /_  
/_/  /_/\\__,_/_/\\__, /_/   \\___/\\__/  
               /____/                 

 [!] Checking username...
 [+] Twitter: Found
`
  },
  {
    id: 'userrecon',
    name: 'UserRecon',
    author: 'thelinuxchoice',
    description: 'Find usernames across over 75 social media networks.',
    githubUrl: 'https://github.com/thelinuxchoice/userrecon',
    category: 'OSINT',
    installCommand: 'git clone https://github.com/thelinuxchoice/userrecon && cd userrecon && bash userrecon.sh',
    previewOutput: `
   _   _ ___  ___ _ __ 
  | | | / __|/ _ \\ '__|
  | |_| \\__ \\  __/ |   
   \\__,_|___/\\___|_|   
                       
 [!] Checking username: target
`
  },

  // ==========================
  // PHISHING & SOCIAL ENGINEERING
  // ==========================
  {
    id: 'zphisher',
    name: 'ZPhisher',
    author: 'htr-tech',
    description: 'Automated Phishing Tool with 30+ Templates.',
    githubUrl: 'https://github.com/htr-tech/zphisher',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/htr-tech/zphisher.git && cd zphisher && bash zphisher.sh',
    previewOutput: `
 [1] Facebook      [2] Instagram
 [3] Google        [4] Microsoft
 [5] Netflix       [6] Paypal
 
 [99] About        [00] Exit
    `
  },
  {
    id: 'camphish',
    name: 'CamPhish',
    author: 'techchipnet',
    description: 'Grab cam shots from target\'s phone front camera or PC webcam.',
    githubUrl: 'https://github.com/techchipnet/CamPhish',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/techchipnet/CamPhish && cd CamPhish && bash camphish.sh',
    previewOutput: `
  ____ ____  __  __ ____  _     _     _
 / ___/ _  \\|  \\/  |  _ \\| |__ (_)___| |__
| |  | | | || |\\/| | |_) | '_ \\| / __| '_ \\
 
 [1] Serveo.net (Recommended)
 [2] Ngrok
`
  },
  {
    id: 'pyphisher',
    name: 'PyPhisher',
    author: 'KasRoudra',
    description: 'Ultimate Phishing Tool in Python3 with OTP support.',
    githubUrl: 'https://github.com/KasRoudra/PyPhisher',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/KasRoudra/PyPhisher && cd PyPhisher && python3 pyphisher.py',
    previewOutput: `
  ____        ____  _     _     _
 |  _ \\ _   _|  _ \\| |__ (_)___| |__   ___ _ __
 | |_) | | | | |_) | '_ \\| / __| '_ \\ / _ \\ '__|
 |  __/| |_| |  __/| | | | \\__ \\ | | |  __/ |
 |_|    \\__, |_|   |_| |_|_|___/_| |_|\\___|_|
        |___/

 [!] Select a template...
`
  },
  {
    id: 'nexphisher',
    name: 'NexPhisher',
    author: 'htr-tech',
    description: 'Advanced Phishing tool for Linux & Termux.',
    githubUrl: 'https://github.com/htr-tech/nexphisher',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/htr-tech/nexphisher && cd nexphisher && bash nexphisher.bash',
    previewOutput: `
  _   _           ____  _     _     _
 | \\ | | _____  _|  _ \\| |__ (_)___| |__   ___ _ __
 |  \\| |/ _ \\ \\/ / |_) | '_ \\| / __| '_ \\ / _ \\ '__|
 | |\\  |  __/>  <|  __/| | | | \\__ \\ | | |  __/ |
 |_| \\_|\\___/_/\\_\\_|   |_| |_|_|___/_| |_|\\___|_|

 [1] Facebook   [2] Instagram
`
  },
  {
    id: 'maskphish',
    name: 'MaskPhish',
    author: 'jaykali',
    description: 'Hide Phishing URL under a normal looking URL (Google, Facebook).',
    githubUrl: 'https://github.com/jaykali/maskphish',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/jaykali/maskphish && cd maskphish && bash maskphish.sh',
    previewOutput: `
  __  __           _    _____  _     _     _
 |  \\/  | __ _ ___| | _|  __ \\| |__ (_)___| |__
 | |\\/| |/ _\` / __| |/ / |__) | '_ \\| / __| '_ \\
 | |  | | (_| \\__ \\   <|  ___/| | | | \\__ \\ | | |
 |_|  |_|\\__,_|___/_|\\_\\_|    |_| |_|_|___/_| |_|

 [!] Paste Phishing URL: ...
`
  },
  {
    id: 'advphishing',
    name: 'AdvPhishing',
    author: 'Ignitetch',
    description: 'Phishing tool with OTP bypass capabilities.',
    githubUrl: 'https://github.com/Ignitetch/AdvPhishing',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/Ignitetch/AdvPhishing && cd AdvPhishing && bash Linux-Setup.bash && bash AdvPhishing.sh',
    previewOutput: `
     _       _       ____  _     _     _     _
    / \\   __| |_   _|  _ \\| |__ (_)___| |__ (_)_ __   __ _
   / _ \\ / _\` \\ \\ / / |_) | '_ \\| / __| '_ \\| | '_ \\ / _\` |
  / ___ \\ (_| |\\ V /|  __/| | | | \\__ \\ | | | | | | | (_| |
 /_/   \\_\\__,_| \\_/ |_|   |_| |_|_|___/_| |_|_|_| |_|\\__, |
                                                     |___/
`
  },
  {
    id: 'socialfish',
    name: 'SocialFish',
    author: 'UndeadSec',
    description: 'Educational Phishing Tool & Information Collector.',
    githubUrl: 'https://github.com/UndeadSec/SocialFish',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/UndeadSec/SocialFish && cd SocialFish && pip install -r requirements.txt && python3 SocialFish.py',
    previewOutput: `
  ____            _       _ _____ _     _
 / ___|  ___   ___(_) __ _| |  ___(_)___| |__
 \\___ \\ / _ \\ / __| |/ _\` | | |_  | / __| '_ \\
  ___) | (_) | (__| | (_| | |  _| | \\__ \\ | | |
 |____/ \\___/ \\___|_|\\__,_|_|_|   |_|___/_| |_|
`
  },
  {
    id: 'wishfish',
    name: 'WishFish',
    author: 'kinghacker0',
    description: 'Social Engineering Tool.',
    githubUrl: 'https://github.com/kinghacker0/WishFish',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/kinghacker0/WishFish && cd WishFish && bash wishfish.sh',
    previewOutput: `
 __      __   _       _      _____  _       _     
 \\ \\    / /  (_)     | |    |  ___|(_)     | |    
  \\ \\  / /__  _  ___ | |__  | |__   _  ___ | |__  
   \\ \\/ / _ \\| |/ __|| '_ \\ |  __| | |/ __|| '_ \\ 
    \\  / (_) | |\\__ \\| | | || |    | |\\__ \\| | | |
     \\/ \\___/|_||___/|_| |_||_|    |_||___/|_| |_|
`
  },
  {
    id: 'lockphish',
    name: 'Lockphish',
    author: 'JasonJerry',
    description: 'Lock screen phishing tool to grab credentials.',
    githubUrl: 'https://github.com/JasonJerry/lockphish',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/JasonJerry/lockphish && cd lockphish && bash lockphish.sh',
    previewOutput: `
  _                _    ____  _     _     _
 | |    ___   ___ | | _|  _ \\| |__ (_)___| |__
 | |   / _ \\ / __|| |/ / |_) | '_ \\| / __| '_ \\
 | |__| (_) | (__ |   <|  __/| | | | \\__ \\ | | |
 |_____\\___/ \\___||_|\\_\\_|   |_| |_|_|___/_| |_|

 [!] Redirecting to lock screen...
`
  },
  {
    id: 'saycheese',
    name: 'SayCheese',
    author: 'keralahacker',
    description: 'Grab target photo from webcam (Port of thelinuxchoice).',
    githubUrl: 'https://github.com/keralahacker/SayCheese',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/keralahacker/SayCheese && cd SayCheese && bash saycheese.sh',
    previewOutput: `
  ____              ____ _
 / ___|  __ _ _   _| ___| |__   ___  ___  ___  ___
 \\___ \\ / _\` | | | | |   | '_ \\ / _ \\/ _ \\/ __|/ _ \\
  ___) | (_| | |_| | |___| | | |  __/  __/\\__ \\  __/
 |____/ \\__,_|\\__, |\\____|_| |_|\\___|\\___||___/\\___|
              |___/

 [!] Starting PHP server...
`
  },
  {
    id: 'blackeye',
    name: 'BlackEye',
    author: 'An0nUD4Y',
    description: 'The most complete Phishing Tool, with 32 templates.',
    githubUrl: 'https://github.com/An0nUD4Y/blackeye',
    category: 'Phishing',
    installCommand: 'git clone https://github.com/An0nUD4Y/blackeye && cd blackeye && bash blackeye.sh',
    previewOutput: `
  ____  _            _    _____            
 |  _ \\| |          | |  |  ___|           
 | |_) | | __ _  ___| | _| |__ _   _  ___  
 |  _ <| |/ _\` |/ __| |/ /  __| | | |/ _ \\ 
 | |_) | | (_| | (__|   <| |__| |_| |  __/ 
 |____/|_|\\__,_|\\___|_|\\_\\____/\\__, |\\___| 
                                __/ |      
                               |___/       
`
  },

  // ==========================
  // EXPLOIT & VULNERABILITY
  // ==========================
  {
    id: 'routersploit',
    name: 'Routersploit',
    author: 'threat9',
    description: 'Exploitation Framework for Embedded Devices.',
    githubUrl: 'https://github.com/threat9/routersploit',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/threat9/routersploit && cd routersploit && python3 -m pip install -r requirements.txt && python3 rsf.py',
    isRoot: true,
    previewOutput: `
      __
     /  \\
    |    |  _   _
    |____| | |_| |
     \\  /  |  _  |
      \\/   |_| |_|

 rsf > use scanners/autopwn
`
  },
  {
    id: 'xsstrike',
    name: 'XSStrike',
    author: 's0md3v',
    description: 'Advanced XSS Detection Suite.',
    githubUrl: 'https://github.com/s0md3v/XSStrike',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/s0md3v/XSStrike && cd XSStrike && pip install -r requirements.txt',
    previewOutput: `
 __   __ _____ _____ _        _ _
 \\ \\ / // ____/ ____| |      (_) |
  \\ V /| (___| (___ | |_ _ __ _| | _____
   > <  \\___ \\\\___ \\| __| '__| | |/ / _ \\
  / . \\ ____) |___) | |_| |  | |   <  __/
 /_/ \\_\\_____/_____/ \\__|_|  |_|_|\\_\\___|

 [!] Enter URL: http://test.com/search?q=
`
  },
  {
    id: 'sqlmate',
    name: 'Sqlmate',
    author: 's0md3v',
    description: 'A friend of SQLmap which does what SQLmap doesn\'t.',
    githubUrl: 'https://github.com/s0md3v/sqlmate',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/s0md3v/sqlmate && cd sqlmate && pip install -r requirements.txt',
    previewOutput: `
  ___  __ _ _ __ ___   __ _| |_ ___ 
 / __|/ _\` | '_ \` _ \\ / _\` | __/ _ \\
 \\__ \\ (_| | | | | | | (_| | ||  __/
 |___/\\__, |_| |_| |_|\\__,_|\\__\\___|
         | |                        
         |_|                        
 [1] Find Admin Panel
 [2] Hash Cracker
`
  },
  {
    id: 'commix',
    name: 'Commix',
    author: 'commixproject',
    description: 'Automated All-in-One OS Command Injection and Exploitation Tool.',
    githubUrl: 'https://github.com/commixproject/commix',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/commixproject/commix && cd commix && python commix.py',
    previewOutput: `
   ___   ___  _ __ ___  _ __ ___ (_)_  __
  / __| / _ \\| '_ \` _ \\| '_ \` _ \\| \\ \\/ /
 | (__ | (_) | | | | | | | | | | | |>  < 
  \\___| \\___/|_| |_| |_|_| |_| |_|_/_/\\_\\
                                         
 [!] Checking connection to target...
`
  },
  {
    id: 'wifite2',
    name: 'Wifite2',
    author: 'derv82',
    description: 'Rewrite of the popular wireless network auditor. (Requires Root & Monitor Mode).',
    githubUrl: 'https://github.com/derv82/wifite2',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/derv82/wifite2 && cd wifite2 && sudo python Wifite.py',
    isRoot: true,
    previewOutput: `
   .               .    
 .´  ·  .     .  ·  \`.  Wifite2
 :  :  :  ( )  :  :  :  
 \`.  ·  \` / \\ \`  ·  .´  
   \`     /   \\     ´    
        /     \\         

 [!] Scanning for wireless networks...
`
  },
  {
    id: 'airgeddon',
    name: 'Airgeddon',
    author: 'v1s1t0r1sh3r3',
    description: 'Multi-use bash script for Linux systems to audit wireless networks. (Requires Root).',
    githubUrl: 'https://github.com/v1s1t0r1sh3r3/airgeddon',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/v1s1t0r1sh3r3/airgeddon && cd airgeddon && sudo bash airgeddon.sh',
    isRoot: true,
    previewOutput: `
  ___ _       ___ ___  __  __  __  _  _ 
 /   (_) ___ /  _| __||  \\|  \\/  \\| \\| |
 | - | ||  _||  _|| _|| o | o | o | .  |
 |_|_|_||_|  |_| |___||__/|__/\\__/|_|\\_|
                                        
 [1] Select Interface
 [2] Put Interface in Monitor Mode
`
  },
  {
    id: 'easymap',
    name: 'Easymap',
    author: 'Cvar1984',
    description: 'Nmap shortcut and scanner for easier usage.',
    githubUrl: 'https://github.com/Cvar1984/Easymap',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/Cvar1984/Easymap && cd Easymap && sh install.sh',
    previewOutput: `
  _____                     __  __             
 | ____| __ _ ___ _   _    |  \\/  | __ _ _ __  
 |  _|  / _\` / __| | | |   | |\\/| |/ _\` | '_ \\ 
 | |___| (_| \\__ \\ |_| |_  | |  | | (_| | |_) |
 |_____|\\__,_|___/\\__, ( ) |_|  |_|\\__,_| .__/ 
                  |___/|/               |_|    

 [1] Scan single IP
 [2] Scan Network
`
  },
  {
    id: 'androrat',
    name: 'AndroRAT',
    author: 'karma9874',
    description: 'Remote Administration Tool for Android (Educational).',
    githubUrl: 'https://github.com/karma9874/AndroRAT',
    category: 'Exploit',
    installCommand: 'git clone https://github.com/karma9874/AndroRAT && cd AndroRAT && pip install -r requirements.txt',
    previewOutput: `
     _              _           ____      _  _____ 
    / \\   _ __   __| |_ __ ___ |  _ \\    / \\|_   _|
   / _ \\ | '_ \\ / _\` | '__/ _ \\| |_) |  / _ \\ | |  
  / ___ \\| | | | (_| | | | (_) |  _ <  / ___ \\| |  
 /_/   \\_\\_| |_|\\__,_|_|  \\___/|_| \\_\\/_/   \\_\\_|  

 [!] Generating APK...
`
  },
  {
    id: 'metasploit-install',
    name: 'Metasploit',
    author: 'Rapid7',
    description: 'The world\'s most used penetration testing framework.',
    githubUrl: 'https://github.com/rapid7/metasploit-framework',
    category: 'Exploit',
    installCommand: 'pkg install metasploit',
    previewOutput: `
  ______________________________________________________________________________
 |                                                                              |
 |                   METASPLOIT FRAMEWORK                                       |
 |______________________________________________________________________________|
 
       =[ metasploit v6.x.x-dev                          ]
 + -- --=[ 2000 exploits - 1100 auxiliary - 350 post       ]
 + -- --=[ 590 payloads - 45 encoders - 10 nops            ]
 + -- --=[ 7 evasion                                       ]
`
  },
  {
    id: 'sqlmap-tool',
    name: 'SQLMap',
    author: 'sqlmapproject',
    description: 'Automatic SQL injection and database takeover tool.',
    githubUrl: 'https://github.com/sqlmapproject/sqlmap',
    category: 'Exploit',
    installCommand: 'git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git sqlmap-dev && cd sqlmap-dev && python sqlmap.py',
    previewOutput: `
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.5.x#dev}
|_ -| . [.]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

 Usage: python sqlmap.py [options]
`
  },

  // ==========================
  // SPAM & DOS
  // ==========================
  {
    id: 'tbomb',
    name: 'TBomb',
    author: 'TheSpeedX',
    description: 'International SMS and Call Bomber (For Educational Purposes Only).',
    githubUrl: 'https://github.com/TheSpeedX/TBomb',
    category: 'Spam',
    installCommand: 'git clone https://github.com/TheSpeedX/TBomb.git && cd TBomb && ./TBomb.sh',
    previewOutput: `
      _______  ____                  _
     |_   _| ||  _ \\                | |
       | | | || |_) | ___  _ __ ___ | |__
      _| |_| || |_) | (_) | | | | | | |_) |
     |_____|_||____/ \\___/|_| |_| |_|_.__/

     [+] Enter Target Number: +62812xxxx
`
  },
  {
    id: 'hammer',
    name: 'Hammer',
    author: 'cyweb',
    description: 'DoS tool - DDoS Script (Python 3).',
    githubUrl: 'https://github.com/cyweb/hammer',
    category: 'Spam',
    installCommand: 'git clone https://github.com/cyweb/hammer && cd hammer && python3 hammer.py',
    previewOutput: `
      _   _                               
     | | | | __ _ _ __ ___  _ __ ___   ___
     | |_| |/ _\` | '_ \` _ \\| '_ \` _ \\ / _ \\
     |  _  | (_| | | | | | | | | | | |  __/
     |_| |_|\\__,_|_| |_| |_|_| |_| |_|\\___|
`
  },
  {
    id: 'xerxes',
    name: 'Xerxes',
    author: 'XCHADX',
    description: 'Most powerful DoS tool (C Language).',
    githubUrl: 'https://github.com/XCHADX/XERXES',
    category: 'Spam',
    installCommand: 'git clone https://github.com/XCHADX/XERXES && cd XERXES && gcc xerxes.c -o xerxes',
    previewOutput: `
 XERXES - The most powerful DoS tool
 Usage: ./xerxes www.target.com 80
`
  },
  {
    id: 'goldeneye',
    name: 'GoldenEye',
    author: 'jseidl',
    description: 'GoldenEye Layer 7 DoS Tool.',
    githubUrl: 'https://github.com/jseidl/GoldenEye',
    category: 'Spam',
    installCommand: 'git clone https://github.com/jseidl/GoldenEye && cd GoldenEye && python goldeneye.py',
    previewOutput: `
   GoldenEye v2.1 (Layer 7 DoS)
   [!] Usage: ./goldeneye.py <url> [options]
`
  },
  {
    id: 'slowloris',
    name: 'Slowloris',
    author: 'gkbrk',
    description: 'Low bandwidth DoS tool.',
    githubUrl: 'https://github.com/gkbrk/slowloris',
    category: 'Spam',
    installCommand: 'git clone https://github.com/gkbrk/slowloris && cd slowloris && python3 slowloris.py',
    previewOutput: `
 Slowloris - Low bandwidth DoS tool
 [!] Attacking target...
 [!] Socket count: 100
`
  },
  {
    id: 'hulk',
    name: 'Hulk',
    author: 'grafov',
    description: 'HULK (HTTP Unbearable Load King) DoS tool.',
    githubUrl: 'https://github.com/grafov/hulk',
    category: 'Spam',
    installCommand: 'git clone https://github.com/grafov/hulk && cd hulk && go run hulk.go',
    previewOutput: `
 HULK - HTTP Unbearable Load King
 [!] Launching attack...
`
  },
  {
    id: 'litespam',
    name: 'Litespam',
    author: '4L13199',
    description: 'SMS & Call Bomber tool.',
    githubUrl: 'https://github.com/4L13199/LITESPAM',
    category: 'Spam',
    installCommand: 'git clone https://github.com/4L13199/LITESPAM && cd LITESPAM && sh LITESPAM.sh',
    previewOutput: `
  _     _ _                               
 | |   (_) |_ ___ ___ _ __   __ _ _ __ ___ 
 | |   | | __/ _ \\/ __| '_ \\ / _\` | '_ \` _ \\
 | |___| | ||  __/\\__ \\ |_) | (_| | | | | | |
 |_____|_|\\__\\___||___/ .__/ \\__,_|_| |_| |_|
                      |_|                    
`
  },

  // ==========================
  // UTILITY & INSTALLERS
  // ==========================
  {
    id: 'lazymux',
    name: 'Lazymux',
    author: 'Gameye98',
    description: 'Tool installer for Termux. Installs various hacking tools easily.',
    githubUrl: 'https://github.com/Gameye98/Lazymux',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Gameye98/Lazymux && cd Lazymux && python lazymux.py',
    previewOutput: `
    _                                    
   | |   __ _ _____   _ _ __ ___  _   ___
   | |  / _\` |_  / | | | '_ \` _ \\| | | \\ \\
   | |___ (_| |/ /| |_| | | | | | | |_| |>
   |_____\\__,_/___|\\__, |_| |_| |_|\\__,_/_/
                   |___/                      

   [01] Information Gathering
   [02] Vulnerability Scanner
`
  },
  {
    id: 'tool-x',
    name: 'Tool-X',
    author: 'Rajkumrdusad',
    description: 'A Kali Linux hacking tools installer for Termux.',
    githubUrl: 'https://github.com/Rajkumrdusad/Tool-X',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Rajkumrdusad/Tool-X.git && cd Tool-X && sh install.aex',
    previewOutput: `
  _______           _        __   __
 |__   __|         | |       \\ \\ / /
    | | ___   ___  | | ______ \\ V /
    | |/ _ \\ / _ \\ | ||______| > <

 [0] Install All Tools
 [1] Show All Tools
`
  },
  {
    id: 'onex',
    name: 'Onex',
    author: 'rajkumardusad',
    description: 'A library of hacking tools for Termux.',
    githubUrl: 'https://github.com/rajkumardusad/onex',
    category: 'Utility',
    installCommand: 'git clone https://github.com/rajkumardusad/onex && cd onex && chmod +x onex && ./onex',
    previewOutput: `
   ___  _   _ _______  __
  / _ \\| \\ | | ____\\ \\/ /
 | | | |  \\| |  _|  \\  / 
 | |_| | |\\  | |___ /  \\ 
  \\___/|_| \\_|_____/_/\\_\\
                         
 [1] Install Tools
 [2] Update
`
  },
  {
    id: 'fsociety',
    name: 'Fsociety',
    author: 'Manisso',
    description: 'Hacking Tools Pack based on Mr. Robot.',
    githubUrl: 'https://github.com/Manisso/fsociety',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Manisso/fsociety && cd fsociety && python2 fsociety.py',
    previewOutput: `
  __              _      _         
 / _|___  ___  __(_) ___| |_ _   _ 
| |_/ __|/ _ \\/ __| |/ _ \\ __| | | |
|  _\\__ \\ (_) \\__ \\ |  __/ |_| |_| |
|_| |___/\\___/|___/_|\\___|\\__|\\__, |
                              |___/ 
`
  },
  {
    id: 'cupp',
    name: 'CUPP',
    author: 'Mebus',
    description: 'Common User Password Profiler - Interactive password list generator.',
    githubUrl: 'https://github.com/Mebus/cupp',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Mebus/cupp && cd cupp && python3 cupp.py -i',
    previewOutput: `
  ___  _   _  ___  ___
 / __|| | | || _ \\| _ \\
( (__ | |_| ||  _/|  _/
 \\___| \\___/ |_|  |_|

 > First Name: John
 > Surname: Doe
`
  },
  {
    id: 'termux-ohmyzsh',
    name: 'Termux OhMyZsh',
    author: 'Cabbagec',
    description: 'A beautiful and reliable zsh configuration for Termux.',
    githubUrl: 'https://github.com/Cabbagec/termux-ohmyzsh',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Cabbagec/termux-ohmyzsh && cd termux-ohmyzsh && ./install.sh',
    previewOutput: `
   ____  __    __  ____  _  _  ____  __  __ 
  (  _ \\(  )  (  )(_  _)( \\/ )(  _ \\(  )(  )
   )___/ )(__  )(   )(   )  (  )___/ )(__)( 
  (__)  (____)(__) (__) (_/\\_)(__)  (______)

  [!] Installing zsh...
  [!] Color scheme set to agnoster...
`
  },
  {
    id: 'termux-style',
    name: 'Termux Style',
    author: 'adi1090x',
    description: 'Change color schemes and fonts of Termux.',
    githubUrl: 'https://github.com/adi1090x/termux-style',
    category: 'Utility',
    installCommand: 'git clone https://github.com/adi1090x/termux-style && cd termux-style && ./install',
    previewOutput: `
  _______                                  _____ __        __
 |__   __|                                / ____|  |      | |
    | | ___ _ __ _ __ ___  _   ___  __   | (___ | |_ _   _| | ___ 
    | |/ _ \\ '__| '_ \` _ \\| | | | | | | |_| |>  <     ____) | |_| |_| | |  __/
    | |  __/ |  | | | | | | |_| |>  <     ____) | |_| |_| | |  __/
    |_|\\___|_|  |_| |_| |_|\\__,_/_/\\_\\   |_____/ \\__|\\__, |_|\\___|
                                                      __/ |       
                                                     |___/        
 [1] Colors
 [2] Fonts
`
  },
  {
    id: 'hash-buster',
    name: 'Hash-Buster',
    author: 's0md3v',
    description: 'Crack hashes in seconds using online databases.',
    githubUrl: 'https://github.com/s0md3v/Hash-Buster',
    category: 'Utility',
    installCommand: 'git clone https://github.com/s0md3v/Hash-Buster && cd Hash-Buster && make install',
    previewOutput: `
  _  _          _        ___          _           
 | || |__ _ ___| |__    | _ )_  _ ___| |_ ___ _ _ 
 | __ / _\` (_-< ' \\   | _ \\ || (_-<  _/ -_) '_|
 |_||_\\__,_/__/_||_|   |___/\\_,_/__/\\__\\___|_|  

 [!] Enter Hash: 5e884898da28047151d0e56f8dc62927
 [+] Decoded: password
`
  },
  {
    id: 'webkiller',
    name: 'WebKiller',
    author: 'UltrafunkAmsterdam',
    description: 'Information Gathering Tool written in Python.',
    githubUrl: 'https://github.com/UltrafunkAmsterdam/WebKiller',
    category: 'Utility',
    installCommand: 'git clone https://github.com/UltrafunkAmsterdam/WebKiller && cd WebKiller && python3 webkiller.py',
    previewOutput: `
 __      __      ___.   ____  __._____________  .__  .__                
/  \\    /  \\ ____\\_ |__|    |/ _|   \\______   \\ |  | |  |   ___________ 
\\   \\/\\/   // __ \\| __ \\      < |   ||    |  _/ |  | |  | _/ __ \\_  __ \\
 \\        /\\  ___/| \\_\\ \\    |  \\   ||    |   \\ |  |_|  |_\\  ___/|  | \\/
  \\__/\\  /  \\___  >___  /____|__ \\__||______  / |____/____/\\___  >__|   
       \\/       \\/    \\/        \\/          \\/                 \\/       

 [1] DNS Lookup
 [2] Whois Lookup
`
  },
  {
    id: 'crawlbox',
    name: 'CrawlBox',
    author: 'm4ll0k',
    description: 'Brute force web directory.',
    githubUrl: 'https://github.com/m4ll0k/CrawlBox',
    category: 'Utility',
    installCommand: 'git clone https://github.com/m4ll0k/CrawlBox && cd CrawlBox && python setup.py install',
    previewOutput: `
   __________  ___ _       ____  ____  __  __
  / ____/ __ \\/   | |     / / / / / __ )/ / / /
 / /   / /_/ / /| | | /| / / / / / __  / / / / 
/ /___/ _, _/ ___ | |/ |/ / /___/ /_/ / /_/ /  
\\____/_/ |_/_/  |_|__/|__/_____/_____/\\____/   
                                               
 [!] URL: http://site.com
 [!] Wordlist: common.txt
`
  },
  {
    id: 'black-hydra',
    name: 'Black-Hydra',
    author: 'Gameye98',
    description: 'Brute force attack tool using Hydra.',
    githubUrl: 'https://github.com/Gameye98/Black-Hydra',
    category: 'Utility',
    installCommand: 'git clone https://github.com/Gameye98/Black-Hydra && cd Black-Hydra && python blackhydra.py',
    previewOutput: `
  ____  _            _        _   _           _
 |  _ \\| | __ _  ___| | __   | | | |_   _  __| |_ __ __ _
 | |_) | |/ _\` |/ __| |/ /   | |_| | | | |/ _\` | '__/ _\` |
 |  __/| | (_| | (__|   <    |  _  | |_| | (_| | | | (_| |
 |_|   |_|\\__,_|\\___|_|\\_\\___|_| |_|\\__, |\\__,_|_|  \\__,_|
                        |_____|     |___/

 [1] SSH
 [2] FTP
`
  },
  {
    id: 'termux-lazyscript',
    name: 'Termux Lazyscript',
    author: 'TechnicalMujeeb',
    description: 'Scripts installer for Termux.',
    githubUrl: 'https://github.com/TechnicalMujeeb/Termux-Lazyscript',
    category: 'Utility',
    installCommand: 'git clone https://github.com/TechnicalMujeeb/Termux-Lazyscript && cd Termux-Lazyscript && chmod +x * && ./setup.sh',
    previewOutput: `
  _______                                  
 |__   __|                                 
    | | ___ _ __ _ __ ___  _   ___  __     
    | |/ _ \\ '__| '_ \` _ \\| | | \\ \\/ /     
    | |  __/ |  | | | | | | |_| |>  <      
    |_|\\___|_|  |_| |_| |_|\\__,_/_/\\_\\     
                                           
 [1] Information Gathering
 [2] Password Attacks
`
  },
  {
    id: 'ubuntu-in-termux',
    name: 'Ubuntu in Termux',
    author: 'MFDGaming',
    description: 'Install Ubuntu OS in Termux easily.',
    githubUrl: 'https://github.com/MFDGaming/ubuntu-in-termux',
    category: 'Utility',
    installCommand: 'git clone https://github.com/MFDGaming/ubuntu-in-termux && cd ubuntu-in-termux && chmod +x ubuntu.sh && ./ubuntu.sh',
    previewOutput: `
   _   _ _                  _         
  | | | | |__  _   _ _ __ | |_ _   _ 
  | | | | '_ \\| | | | '_ \\| __| | | |
  | |_| | |_) | |_| | | | | |_| |_| |
   \\___/|_.__/ \\__,_|_| |_|\\__|\\__,_|

  [!] Downloading Ubuntu rootfs...
`
  },
  {
    id: 'nethunter',
    name: 'Nethunter Termux',
    author: 'Kali Linux',
    description: 'Install Kali Nethunter rootless in Termux.',
    githubUrl: 'https://www.kali.org/docs/nethunter/nethunter-rootless/',
    category: 'Utility',
    installCommand: 'termux-setup-storage && pkg install wget && wget -O install-nethunter-termux https://offs.ec/2MceZWr && chmod +x install-nethunter-termux && ./install-nethunter-termux',
    previewOutput: `
  _  __     _ _    _  _     _   _  _          _           
 | |/ /__ _| (_)  | \\| |___| |_| || |_  _ _ _| |_ ___ _ _ 
 | ' </ _\` | | |  | .\` / -_)  _| __ | || | ' \\  _/ -_) '_|
 |_|\\_\\__,_|_|_|  |_|\\_\\___|\\__|_||_\\_,_|_||_\\__\\___|_|  
 
 [!] Checking device compatibility...
`
  }
];

export const PACKAGES: PackageItem[] = [
  // ==========================================
  // DEVELOPMENT: PROGRAMMING LANGUAGES
  // ==========================================
  {
    id: 'python',
    name: 'Python',
    category: 'Development',
    description: 'High-level programming language suitable for scripting and data science.',
    installCommand: 'pkg install python',
    notes: 'Installs Python 3.x. Use "pip" to install modules.'
  },
  {
    id: 'python2',
    name: 'Python 2',
    category: 'Development',
    description: 'Legacy version of Python.',
    installCommand: 'pkg install python2',
    notes: 'Legacy support. New projects should use Python 3.'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Development',
    description: 'JavaScript runtime built on Chrome\'s V8 engine (Current).',
    installCommand: 'pkg install nodejs',
  },
  {
    id: 'nodejs-lts',
    name: 'Node.js LTS',
    category: 'Development',
    description: 'Long Term Support version of Node.js.',
    installCommand: 'pkg install nodejs-lts',
  },
  {
    id: 'bun',
    name: 'Bun',
    category: 'Development',
    description: 'Incredibly fast JavaScript runtime, bundler, test runner, and package manager.',
    installCommand: 'pkg install bun',
  },
  {
    id: 'deno',
    name: 'Deno',
    category: 'Development',
    description: 'A modern runtime for JavaScript and TypeScript.',
    installCommand: 'pkg install deno',
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    category: 'Development',
    description: 'Open source programming language supported by Google.',
    installCommand: 'pkg install golang',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Development',
    description: 'Systems programming language focused on safety and performance.',
    installCommand: 'pkg install rust',
    notes: 'Includes cargo package manager.'
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Development',
    description: 'Server-side scripting language for web development.',
    installCommand: 'pkg install php',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'Development',
    description: 'Dynamic, open source programming language.',
    installCommand: 'pkg install ruby',
  },
  {
    id: 'perl',
    name: 'Perl',
    category: 'Development',
    description: 'Highly capable, feature-rich programming language.',
    installCommand: 'pkg install perl',
  },
  {
    id: 'lua',
    name: 'Lua',
    category: 'Development',
    description: 'Powerful, efficient, lightweight, embeddable scripting language.',
    installCommand: 'pkg install lua54',
  },
  {
    id: 'luajit',
    name: 'LuaJIT',
    category: 'Development',
    description: 'Just-In-Time Compiler for Lua.',
    installCommand: 'pkg install luajit',
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'Development',
    description: 'Client-optimized language for fast apps on any platform.',
    installCommand: 'pkg install dart',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    category: 'Development',
    description: 'Modern, concise and safe programming language (JVM).',
    installCommand: 'pkg install kotlin',
  },
  {
    id: 'swift',
    name: 'Swift',
    category: 'Development',
    description: 'General-purpose, multi-paradigm, compiled programming language.',
    installCommand: 'pkg install swift',
  },
  {
    id: 'elixir',
    name: 'Elixir',
    category: 'Development',
    description: 'Dynamic, functional language for scalable applications.',
    installCommand: 'pkg install elixir',
  },
  {
    id: 'erlang',
    name: 'Erlang',
    category: 'Development',
    description: 'Programming language used to build massively scalable soft real-time systems.',
    installCommand: 'pkg install erlang',
  },
  {
    id: 'clojure',
    name: 'Clojure',
    category: 'Development',
    description: 'A dynamic, general-purpose programming language (Lisp on JVM).',
    installCommand: 'pkg install clojure',
  },
  {
    id: 'ghc',
    name: 'Haskell (GHC)',
    category: 'Development',
    description: 'The Glasgow Haskell Compiler.',
    installCommand: 'pkg install ghc',
  },
  {
    id: 'nim',
    name: 'Nim',
    category: 'Development',
    description: 'Statically typed, imperative programming language.',
    installCommand: 'pkg install nim',
  },
  {
    id: 'crystal',
    name: 'Crystal',
    category: 'Development',
    description: 'Language with Ruby-inspired syntax and C-like performance.',
    installCommand: 'pkg install crystal',
  },
  {
    id: 'ocaml',
    name: 'OCaml',
    category: 'Development',
    description: 'General purpose industrial strength programming language.',
    installCommand: 'pkg install ocaml',
  },
  {
    id: 'zig',
    name: 'Zig',
    category: 'Development',
    description: 'General-purpose programming language and toolchain.',
    installCommand: 'pkg install zig',
  },
  {
    id: 'vlang',
    name: 'V (Vlang)',
    category: 'Development',
    description: 'Simple, fast, safe, compiled language.',
    installCommand: 'pkg install vlang',
  },
  {
    id: 'julia',
    name: 'Julia',
    category: 'Development',
    description: 'High-level, high-performance, dynamic language for technical computing.',
    installCommand: 'pkg install julia',
  },
  {
    id: 'r-lang',
    name: 'R',
    category: 'Development',
    description: 'Language and environment for statistical computing and graphics.',
    installCommand: 'pkg install r-base',
  },
  {
    id: 'scala',
    name: 'Scala',
    category: 'Development',
    description: 'Object-oriented meets functional programming.',
    installCommand: 'pkg install scala',
  },
  {
    id: 'gfortran',
    name: 'Fortran',
    category: 'Development',
    description: 'GNU Fortran compiler.',
    installCommand: 'pkg install gfortran',
  },
  {
    id: 'nasm',
    name: 'NASM',
    category: 'Development',
    description: 'Netwide Assembler (x86 assembly).',
    installCommand: 'pkg install nasm',
  },
  {
    id: 'yasm',
    name: 'Yasm',
    category: 'Development',
    description: 'Modular assembler supporting the x86 and AMD64 architectures.',
    installCommand: 'pkg install yasm',
  },
  {
    id: 'iverilog',
    name: 'Icarus Verilog',
    category: 'Development',
    description: 'Verilog simulation and synthesis tool.',
    installCommand: 'pkg install iverilog',
  },
  {
    id: 'openjdk',
    name: 'OpenJDK 17',
    category: 'Development',
    description: 'Open-source implementation of the Java Platform.',
    installCommand: 'pkg install openjdk-17',
  },
  {
    id: 'openjdk-21',
    name: 'OpenJDK 21',
    category: 'Development',
    description: 'Latest LTS release of the Java Platform.',
    installCommand: 'pkg install openjdk-21',
  },

  // ==========================================
  // DEVELOPMENT: COMPILERS & BUILD TOOLS
  // ==========================================
  {
    id: 'clang',
    name: 'Clang',
    category: 'Development',
    description: 'C language family frontend for LLVM.',
    installCommand: 'pkg install clang',
    notes: 'Acts as gcc in Termux.'
  },
  {
    id: 'gcc',
    name: 'GCC (Wrapper)',
    category: 'Development',
    description: 'GNU Compiler Collection wrapper (often aliases to clang).',
    installCommand: 'pkg install gcc',
  },
  {
    id: 'build-essential',
    name: 'Build Essential',
    category: 'Development',
    description: 'Installs clang, make, and other tools required for compiling software.',
    installCommand: 'pkg install build-essential',
  },
  {
    id: 'make',
    name: 'Make',
    category: 'Development',
    description: 'Build automation tool.',
    installCommand: 'pkg install make',
  },
  {
    id: 'cmake',
    name: 'CMake',
    category: 'Development',
    description: 'Cross-platform family of tools designed to build, test and package software.',
    installCommand: 'pkg install cmake',
  },
  {
    id: 'ninja',
    name: 'Ninja',
    category: 'Development',
    description: 'Small build system with a focus on speed.',
    installCommand: 'pkg install ninja',
  },
  {
    id: 'autoconf',
    name: 'Autoconf',
    category: 'Development',
    description: 'Extensible package of M4 macros.',
    installCommand: 'pkg install autoconf',
  },
  {
    id: 'automake',
    name: 'Automake',
    category: 'Development',
    description: 'Tool for automatically generating Makefile.in files.',
    installCommand: 'pkg install automake',
  },
  {
    id: 'libtool',
    name: 'Libtool',
    category: 'Development',
    description: 'Generic library support script.',
    installCommand: 'pkg install libtool',
  },
  {
    id: 'pkg-config',
    name: 'Pkg-config',
    category: 'Development',
    description: 'Helper tool used when compiling applications and libraries.',
    installCommand: 'pkg install pkg-config',
  },
  {
    id: 'binutils',
    name: 'Binutils',
    category: 'Development',
    description: 'Binary tools (linker, assembler, strip, etc).',
    installCommand: 'pkg install binutils',
  },
  {
    id: 'gdb',
    name: 'GDB',
    category: 'Development',
    description: 'The GNU Project Debugger.',
    installCommand: 'pkg install gdb',
  },
  {
    id: 'lldb',
    name: 'LLDB',
    category: 'Development',
    description: 'Next generation, high-performance debugger.',
    installCommand: 'pkg install lldb',
  },
  {
    id: 'valgrind',
    name: 'Valgrind',
    category: 'Development',
    description: 'Instrumentation framework for building dynamic analysis tools.',
    installCommand: 'pkg install valgrind',
  },
  {
    id: 'radare2',
    name: 'Radare2',
    category: 'Development',
    description: 'Unix-like reverse engineering framework.',
    installCommand: 'pkg install radare2',
  },
  {
    id: 'strace',
    name: 'Strace',
    category: 'Development',
    description: 'Diagnostic, debugging and instructional userspace utility.',
    installCommand: 'pkg install strace',
  },
  {
    id: 'ltrace',
    name: 'Ltrace',
    category: 'Development',
    description: 'Library call tracer.',
    installCommand: 'pkg install ltrace',
  },

  // ==========================================
  // DEVELOPMENT: DATABASES
  // ==========================================
  {
    id: 'mariadb',
    name: 'MariaDB',
    category: 'Development',
    description: 'One of the most popular database servers (MySQL fork).',
    installCommand: 'pkg install mariadb',
    notes: 'Start with "mysqld_safe".'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Development',
    description: 'Powerful, open source object-relational database system.',
    installCommand: 'pkg install postgresql',
    notes: 'Initialize with "initdb" first.'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'Development',
    description: 'C-language library that implements a SQL database engine.',
    installCommand: 'pkg install sqlite',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Development',
    description: 'In-memory data structure store (cache/broker).',
    installCommand: 'pkg install redis',
  },
  {
    id: 'couchdb',
    name: 'CouchDB',
    category: 'Development',
    description: 'Seamless multi-master sync database.',
    installCommand: 'pkg install couchdb',
  },

  // ==========================================
  // SYSTEM: SHELLS & ENVIRONMENT
  // ==========================================
  {
    id: 'bash',
    name: 'Bash',
    category: 'System',
    description: 'Bourne Again SHell. Default in many Linuxes.',
    installCommand: 'pkg install bash',
  },
  {
    id: 'zsh',
    name: 'Zsh',
    category: 'System',
    description: 'Extended Bourne shell with many improvements.',
    installCommand: 'pkg install zsh',
  },
  {
    id: 'fish',
    name: 'Fish',
    category: 'System',
    description: 'Smart and user-friendly command line shell.',
    installCommand: 'pkg install fish',
  },
  {
    id: 'nushell',
    name: 'Nushell',
    category: 'System',
    description: 'A new type of shell, written in Rust.',
    installCommand: 'pkg install nushell',
  },
  {
    id: 'tcsh',
    name: 'Tcsh',
    category: 'System',
    description: 'C shell with file name completion and command line editing.',
    installCommand: 'pkg install tcsh',
  },
  {
    id: 'ksh',
    name: 'Ksh',
    category: 'System',
    description: 'KornShell is a Unix shell.',
    installCommand: 'pkg install ksh',
  },
  {
    id: 'mosh',
    name: 'Mosh',
    category: 'System',
    description: 'Mobile Shell. Roaming & supports intermittent connectivity.',
    installCommand: 'pkg install mosh',
  },
  {
    id: 'tmux',
    name: 'Tmux',
    category: 'System',
    description: 'Terminal multiplexer.',
    installCommand: 'pkg install tmux',
  },
  {
    id: 'screen',
    name: 'Screen',
    category: 'System',
    description: 'Full-screen window manager.',
    installCommand: 'pkg install screen',
  },
  {
    id: 'termux-api',
    name: 'Termux:API',
    category: 'System',
    description: 'Access Android hardware (Camera, GPS, SMS).',
    installCommand: 'pkg install termux-api',
    notes: 'Requires API app.'
  },
  {
    id: 'termux-tools',
    name: 'Termux Tools',
    category: 'System',
    description: 'Basic scripts for Termux.',
    installCommand: 'pkg install termux-tools',
  },
  {
    id: 'termux-exec',
    name: 'Termux Exec',
    category: 'System',
    description: 'Fixes shebangs for scripts.',
    installCommand: 'pkg install termux-exec',
  },
  {
    id: 'termux-auth',
    name: 'Termux Auth',
    category: 'System',
    description: 'Password authentication for Termux.',
    installCommand: 'pkg install termux-auth',
  },
  {
    id: 'termux-services',
    name: 'Termux Services',
    category: 'System',
    description: 'Service manager (sv/runit).',
    installCommand: 'pkg install termux-services',
  },
  {
    id: 'proot',
    name: 'PRoot',
    category: 'System',
    description: 'Emulate Linux distros without root.',
    installCommand: 'pkg install proot',
  },
  {
    id: 'proot-distro',
    name: 'PRoot Distro',
    category: 'System',
    description: 'Manage Linux distributions (Ubuntu, Arch, Kali).',
    installCommand: 'pkg install proot-distro',
  },
  {
    id: 'tsu',
    name: 'Tsu',
    category: 'System',
    description: 'Sudo wrapper for Rooted devices.',
    installCommand: 'pkg install tsu',
  },
  {
    id: 'cronie',
    name: 'Cronie',
    category: 'System',
    description: 'Daemon for scheduled commands.',
    installCommand: 'pkg install cronie',
  },
  {
    id: 'android-tools',
    name: 'Android Tools',
    category: 'System',
    description: 'ADB and Fastboot.',
    installCommand: 'pkg install android-tools',
  },
  {
    id: 'coreutils',
    name: 'Coreutils',
    category: 'System',
    description: 'Basic file, shell and text manipulation utilities.',
    installCommand: 'pkg install coreutils',
  },
  {
    id: 'busybox',
    name: 'Busybox',
    category: 'System',
    description: 'Swiss Army Knife of embedded Linux.',
    installCommand: 'pkg install busybox',
  },
  {
    id: 'lsof',
    name: 'Lsof',
    category: 'System',
    description: 'List open files.',
    installCommand: 'pkg install lsof',
  },
  {
    id: 'htop',
    name: 'Htop',
    category: 'System',
    description: 'Interactive process viewer.',
    installCommand: 'pkg install htop',
  },
  {
    id: 'btop',
    name: 'Btop',
    category: 'System',
    description: 'Modern resource monitor (C++).',
    installCommand: 'pkg install btop',
  },
  {
    id: 'glances',
    name: 'Glances',
    category: 'System',
    description: 'Cross-platform system monitoring tool.',
    installCommand: 'pkg install glances',
  },
  {
    id: 'procs',
    name: 'Procs',
    category: 'System',
    description: 'Modern replacement for ps.',
    installCommand: 'pkg install procs',
  },
  {
    id: 'neofetch',
    name: 'Neofetch',
    category: 'System',
    description: 'System information tool (Bash).',
    installCommand: 'pkg install neofetch',
  },
  {
    id: 'fastfetch',
    name: 'Fastfetch',
    category: 'System',
    description: 'Faster neofetch alternative (C).',
    installCommand: 'pkg install fastfetch',
  },

  // ==========================================
  // UTILITY: EDITORS & TEXT
  // ==========================================
  {
    id: 'vim',
    name: 'Vim',
    category: 'Utility',
    description: 'Ubiquitous text editor.',
    installCommand: 'pkg install vim',
  },
  {
    id: 'vim-python',
    name: 'Vim (Python)',
    category: 'Utility',
    description: 'Vim with Python support.',
    installCommand: 'pkg install vim-python',
  },
  {
    id: 'neovim',
    name: 'Neovim',
    category: 'Utility',
    description: 'Hyperextensible Vim-based text editor.',
    installCommand: 'pkg install neovim',
  },
  {
    id: 'nano',
    name: 'Nano',
    category: 'Utility',
    description: 'Beginner friendly text editor.',
    installCommand: 'pkg install nano',
  },
  {
    id: 'emacs',
    name: 'Emacs',
    category: 'Utility',
    description: 'Extensible, customizable text editor.',
    installCommand: 'pkg install emacs',
  },
  {
    id: 'micro',
    name: 'Micro',
    category: 'Utility',
    description: 'Modern terminal-based text editor.',
    installCommand: 'pkg install micro',
  },
  {
    id: 'helix',
    name: 'Helix',
    category: 'Utility',
    description: 'Post-modern modal text editor.',
    installCommand: 'pkg install helix',
  },
  {
    id: 'vis',
    name: 'Vis',
    category: 'Utility',
    description: 'Modern editor combining vim and sam.',
    installCommand: 'pkg install vis',
  },
  {
    id: 'kakoune',
    name: 'Kakoune',
    category: 'Utility',
    description: 'Modal editor - selection oriented.',
    installCommand: 'pkg install kakoune',
  },
  {
    id: 'joe',
    name: 'Joe',
    category: 'Utility',
    description: 'Joe\'s Own Editor.',
    installCommand: 'pkg install joe',
  },
  {
    id: 'ed',
    name: 'Ed',
    category: 'Utility',
    description: 'The standard Unix line editor.',
    installCommand: 'pkg install ed',
  },

  // ==========================================
  // NETWORK & SECURITY
  // ==========================================
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'Network',
    description: 'Network exploration tool and security scanner.',
    installCommand: 'pkg install nmap',
  },
  {
    id: 'curl',
    name: 'cURL',
    category: 'Network',
    description: 'Transfer data with URLs.',
    installCommand: 'pkg install curl',
  },
  {
    id: 'wget',
    name: 'Wget',
    category: 'Network',
    description: 'Retrieve files from the web.',
    installCommand: 'pkg install wget',
  },
  {
    id: 'netcat',
    name: 'Netcat (OpenBSD)',
    category: 'Network',
    description: 'Networking utility for reading/writing network connections.',
    installCommand: 'pkg install netcat-openbsd',
  },
  {
    id: 'socat',
    name: 'Socat',
    category: 'Network',
    description: 'Multipurpose relay (so much more than netcat).',
    installCommand: 'pkg install socat',
  },
  {
    id: 'openssh',
    name: 'OpenSSH',
    category: 'Network',
    description: 'SSH client and server.',
    installCommand: 'pkg install openssh',
  },
  {
    id: 'sshpass',
    name: 'SSHPass',
    category: 'Network',
    description: 'Non-interactive ssh password provider.',
    installCommand: 'pkg install sshpass',
  },
  {
    id: 'tor',
    name: 'Tor',
    category: 'Network',
    description: 'Anonymizing overlay network.',
    installCommand: 'pkg install tor',
  },
  {
    id: 'apache2',
    name: 'Apache2',
    category: 'Network',
    description: 'Popular web server.',
    installCommand: 'pkg install apache2',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'Network',
    description: 'High performance web server/proxy.',
    installCommand: 'pkg install nginx',
  },
  {
    id: 'lighttpd',
    name: 'Lighttpd',
    category: 'Network',
    description: 'Secure, fast, compliant, and very flexible web-server.',
    installCommand: 'pkg install lighttpd',
  },
  {
    id: 'tcpdump',
    name: 'Tcpdump',
    category: 'Network',
    description: 'Packet analyzer.',
    installCommand: 'pkg install tcpdump',
    notes: 'Root usually required.'
  },
  {
    id: 'termshark',
    name: 'Termshark',
    category: 'Network',
    description: 'Terminal UI for Wireshark.',
    installCommand: 'pkg install termshark',
  },
  {
    id: 'aria2',
    name: 'Aria2',
    category: 'Network',
    description: 'Lightweight multi-protocol download utility.',
    installCommand: 'pkg install aria2',
  },
  {
    id: 'rclone',
    name: 'Rclone',
    category: 'Network',
    description: 'Manage files on cloud storage.',
    installCommand: 'pkg install rclone',
  },
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    category: 'Network',
    description: 'Video downloader (Youtube-dl fork).',
    installCommand: 'pkg install yt-dlp',
  },
  {
    id: 'cloudflared',
    name: 'Cloudflared',
    category: 'Network',
    description: 'Cloudflare Tunnel client.',
    installCommand: 'pkg install cloudflared',
  },
  {
    id: 'iperf3',
    name: 'iPerf3',
    category: 'Network',
    description: 'Bandwidth measurement tool.',
    installCommand: 'pkg install iperf3',
  },
  {
    id: 'speedtest-go',
    name: 'Speedtest-go',
    category: 'Network',
    description: 'CLI for speedtest.net.',
    installCommand: 'pkg install speedtest-go',
  },
  {
    id: 'dnsutils',
    name: 'DNS Utils',
    category: 'Network',
    description: 'Dig, nslookup, etc.',
    installCommand: 'pkg install dnsutils',
  },
  {
    id: 'whois',
    name: 'Whois',
    category: 'Network',
    description: 'Client for the whois directory service.',
    installCommand: 'pkg install whois',
  },
  {
    id: 'tracepath',
    name: 'Tracepath',
    category: 'Network',
    description: 'Trace path to a network host.',
    installCommand: 'pkg install tracepath',
  },
  {
    id: 'mtr',
    name: 'MTR',
    category: 'Network',
    description: 'Network diagnostic tool.',
    installCommand: 'pkg install mtr',
  },
  {
    id: 'w3m',
    name: 'w3m',
    category: 'Network',
    description: 'Text-based web browser.',
    installCommand: 'pkg install w3m',
  },
  {
    id: 'links',
    name: 'Links',
    category: 'Network',
    description: 'Web browser running in text mode.',
    installCommand: 'pkg install links',
  },
  {
    id: 'lynx',
    name: 'Lynx',
    category: 'Network',
    description: 'Classic text web browser.',
    installCommand: 'pkg install lynx',
  },
  {
    id: 'newsboat',
    name: 'Newsboat',
    category: 'Network',
    description: 'RSS/Atom feed reader.',
    installCommand: 'pkg install newsboat',
  },
  {
    id: 'tmate',
    name: 'Tmate',
    category: 'Network',
    description: 'Instant terminal sharing.',
    installCommand: 'pkg install tmate',
  },
  {
    id: 'rsync',
    name: 'Rsync',
    category: 'Network',
    description: 'Fast file copying tool.',
    installCommand: 'pkg install rsync',
  },
  {
    id: 'mitmproxy',
    name: 'Mitmproxy',
    category: 'Network',
    description: 'Interactive TLS-capable intercepting HTTP proxy.',
    installCommand: 'pkg install mitmproxy',
  },
  {
    id: 'httpx',
    name: 'HTTPX',
    category: 'Network',
    description: 'Fast and multi-purpose HTTP toolkit.',
    installCommand: 'pkg install httpx',
  },
  {
    id: 'websocat',
    name: 'Websocat',
    category: 'Network',
    description: 'Netcat for WebSockets.',
    installCommand: 'pkg install websocat',
  },
  {
    id: 'hydra',
    name: 'Hydra',
    category: 'Network',
    description: 'Login cracker which supports numerous protocols.',
    installCommand: 'pkg install hydra',
  },
  {
    id: 'sqlmap',
    name: 'Sqlmap',
    category: 'Network',
    description: 'Automatic SQL injection tool.',
    installCommand: 'pkg install sqlmap',
  },
  {
    id: 'nikto',
    name: 'Nikto',
    category: 'Network',
    description: 'Web server scanner.',
    installCommand: 'pkg install nikto',
  },
  {
    id: 'aircrack-ng',
    name: 'Aircrack-ng',
    category: 'Network',
    description: 'WiFi security auditing tools.',
    installCommand: 'pkg install aircrack-ng',
    notes: 'Requires Root + Monitor Mode hardware.'
  },
  {
    id: 'bettercap',
    name: 'Bettercap',
    category: 'Network',
    description: 'The Swiss Army knife for network attacks and monitoring.',
    installCommand: 'pkg install bettercap',
  },
  {
    id: 'metasploit',
    name: 'Metasploit',
    category: 'Network',
    description: 'Penetration testing framework.',
    installCommand: 'pkg install metasploit',
    notes: 'Heavy installation.'
  },
  {
    id: 'openvpn',
    name: 'OpenVPN',
    category: 'Network',
    description: 'Full-featured SSL VPN.',
    installCommand: 'pkg install openvpn',
  },
  {
    id: 'wireguard-tools',
    name: 'Wireguard',
    category: 'Network',
    description: 'Next generation VPN.',
    installCommand: 'pkg install wireguard-tools',
  },
  {
    id: 'proxychains-ng',
    name: 'Proxychains',
    category: 'Network',
    description: 'Redirect connections through proxy servers.',
    installCommand: 'pkg install proxychains-ng',
  },
  {
    id: 'macchanger',
    name: 'Macchanger',
    category: 'Network',
    description: 'Utility for viewing/manipulating MAC addresses.',
    installCommand: 'pkg install macchanger',
  },

  // ==========================================
  // UTILITY: FILE MANAGEMENT & CLI TOOLS
  // ==========================================
  {
    id: 'git',
    name: 'Git',
    category: 'Utility',
    description: 'Distributed version control system.',
    installCommand: 'pkg install git',
  },
  {
    id: 'lazygit',
    name: 'LazyGit',
    category: 'Utility',
    description: 'Simple terminal UI for git.',
    installCommand: 'pkg install lazygit',
  },
  {
    id: 'tig',
    name: 'Tig',
    category: 'Utility',
    description: 'Text-mode interface for git.',
    installCommand: 'pkg install tig',
  },
  {
    id: 'gh',
    name: 'GitHub CLI',
    category: 'Utility',
    description: 'GitHub’s official command line tool.',
    installCommand: 'pkg install gh',
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    category: 'Utility',
    description: 'Record, convert and stream audio and video.',
    installCommand: 'pkg install ffmpeg',
  },
  {
    id: 'imagemagick',
    name: 'ImageMagick',
    category: 'Utility',
    description: 'Edit, compose, or convert bitmap images.',
    installCommand: 'pkg install imagemagick',
  },
  {
    id: 'graphicsmagick',
    name: 'GraphicsMagick',
    category: 'Utility',
    description: 'Image processing system.',
    installCommand: 'pkg install graphicsmagick',
  },
  {
    id: 'graphviz',
    name: 'Graphviz',
    category: 'Utility',
    description: 'Graph visualization software.',
    installCommand: 'pkg install graphviz',
  },
  {
    id: 'pandoc',
    name: 'Pandoc',
    category: 'Utility',
    description: 'Universal markup converter.',
    installCommand: 'pkg install pandoc',
  },
  {
    id: 'poppler',
    name: 'Poppler',
    category: 'Utility',
    description: 'PDF rendering library (includes pdfimages, pdftotext).',
    installCommand: 'pkg install poppler',
  },
  {
    id: 'tesseract',
    name: 'Tesseract',
    category: 'Utility',
    description: 'OCR (Optical Character Recognition) engine.',
    installCommand: 'pkg install tesseract',
  },
  {
    id: 'zip',
    name: 'Zip',
    category: 'Utility',
    description: 'Package and compress (archive) files.',
    installCommand: 'pkg install zip',
  },
  {
    id: 'unzip',
    name: 'Unzip',
    category: 'Utility',
    description: 'Extract compressed files.',
    installCommand: 'pkg install unzip',
  },
  {
    id: 'p7zip',
    name: 'p7zip',
    category: 'Utility',
    description: '7-Zip file archiver.',
    installCommand: 'pkg install p7zip',
  },
  {
    id: 'unrar',
    name: 'Unrar',
    category: 'Utility',
    description: 'Extract .rar archives.',
    installCommand: 'pkg install unrar',
  },
  {
    id: 'tar',
    name: 'Tar',
    category: 'Utility',
    description: 'Tape archiver.',
    installCommand: 'pkg install tar',
  },
  {
    id: 'gzip',
    name: 'Gzip',
    category: 'Utility',
    description: 'Compression utility.',
    installCommand: 'pkg install gzip',
  },
  {
    id: 'xz-utils',
    name: 'XZ Utils',
    category: 'Utility',
    description: 'High compression ratio utility.',
    installCommand: 'pkg install xz-utils',
  },
  {
    id: 'zstd',
    name: 'Zstd',
    category: 'Utility',
    description: 'Zstandard compression.',
    installCommand: 'pkg install zstd',
  },
  {
    id: 'jq',
    name: 'JQ',
    category: 'Utility',
    description: 'Command-line JSON processor.',
    installCommand: 'pkg install jq',
  },
  {
    id: 'yq',
    name: 'YQ',
    category: 'Utility',
    description: 'Command-line YAML processor.',
    installCommand: 'pkg install yq',
  },
  {
    id: 'pup',
    name: 'Pup',
    category: 'Utility',
    description: 'HTML processor (jq for html).',
    installCommand: 'pkg install pup',
  },
  {
    id: 'fzf',
    name: 'FZF',
    category: 'Utility',
    description: 'Command-line fuzzy finder.',
    installCommand: 'pkg install fzf',
  },
  {
    id: 'bat',
    name: 'Bat',
    category: 'Utility',
    description: 'Cat clone with syntax highlighting.',
    installCommand: 'pkg install bat',
  },
  {
    id: 'lsd',
    name: 'LSD',
    category: 'Utility',
    description: 'Next gen ls command.',
    installCommand: 'pkg install lsd',
  },
  {
    id: 'eza',
    name: 'Eza',
    category: 'Utility',
    description: 'Modern replacement for ls.',
    installCommand: 'pkg install eza',
  },
  {
    id: 'ripgrep',
    name: 'Ripgrep (rg)',
    category: 'Utility',
    description: 'Fast recursive search tool.',
    installCommand: 'pkg install ripgrep',
  },
  {
    id: 'fd',
    name: 'Fd',
    category: 'Utility',
    description: 'Simple, fast alternative to find.',
    installCommand: 'pkg install fd',
  },
  {
    id: 'sd',
    name: 'Sd',
    category: 'Utility',
    description: 'Find & replace CLI (sed alternative).',
    installCommand: 'pkg install sd',
  },
  {
    id: 'ag',
    name: 'The Silver Searcher',
    category: 'Utility',
    description: 'Code-searching tool similar to ack.',
    installCommand: 'pkg install silversearcher-ag',
  },
  {
    id: 'grep',
    name: 'Grep',
    category: 'Utility',
    description: 'Print lines matching a pattern.',
    installCommand: 'pkg install grep',
  },
  {
    id: 'sed',
    name: 'Sed',
    category: 'Utility',
    description: 'Stream editor.',
    installCommand: 'pkg install sed',
  },
  {
    id: 'gawk',
    name: 'Awk',
    category: 'Utility',
    description: 'Pattern scanning and processing language.',
    installCommand: 'pkg install gawk',
  },
  {
    id: 'mc',
    name: 'Midnight Commander',
    category: 'Utility',
    description: 'Visual file manager.',
    installCommand: 'pkg install mc',
  },
  {
    id: 'ranger',
    name: 'Ranger',
    category: 'Utility',
    description: 'VIM-inspired console file manager.',
    installCommand: 'pkg install ranger',
  },
  {
    id: 'nnn',
    name: 'nnn',
    category: 'Utility',
    description: 'Lightning fast file manager.',
    installCommand: 'pkg install nnn',
  },
  {
    id: 'lf',
    name: 'lf',
    category: 'Utility',
    description: 'Terminal file manager written in Go.',
    installCommand: 'pkg install lf',
  },
  {
    id: 'broot',
    name: 'Broot',
    category: 'Utility',
    description: 'A new way to see and navigate directory trees.',
    installCommand: 'pkg install broot',
  },
  {
    id: 'tree',
    name: 'Tree',
    category: 'Utility',
    description: 'Recursive directory listing.',
    installCommand: 'pkg install tree',
  },
  {
    id: 'ncdu',
    name: 'NCDU',
    category: 'Utility',
    description: 'Analyze disk usage.',
    installCommand: 'pkg install ncdu',
  },
  {
    id: 'dos2unix',
    name: 'Dos2Unix',
    category: 'Utility',
    description: 'Convert DOS line breaks to Unix.',
    installCommand: 'pkg install dos2unix',
  },
  {
    id: 'glow',
    name: 'Glow',
    category: 'Utility',
    description: 'Render markdown on the CLI.',
    installCommand: 'pkg install glow',
  },
  {
    id: 'typst',
    name: 'Typst',
    category: 'Utility',
    description: 'Modern typesetting system.',
    installCommand: 'pkg install typst',
  },
  {
    id: 'pass',
    name: 'Pass',
    category: 'Utility',
    description: 'Standard unix password manager.',
    installCommand: 'pkg install pass',
  },
  {
    id: 'gnupg',
    name: 'GnuPG',
    category: 'Utility',
    description: 'OpenPGP implementation.',
    installCommand: 'pkg install gnupg',
  },
  {
    id: 'taskwarrior',
    name: 'Taskwarrior',
    category: 'Utility',
    description: 'Manage your TODO list.',
    installCommand: 'pkg install taskwarrior',
  },
  {
    id: 'timewarrior',
    name: 'Timewarrior',
    category: 'Utility',
    description: 'Track time from the command line.',
    installCommand: 'pkg install timewarrior',
  },
  {
    id: 'cmus',
    name: 'Cmus',
    category: 'Utility',
    description: 'Console music player.',
    installCommand: 'pkg install cmus',
  },
  {
    id: 'mpv',
    name: 'MPV',
    category: 'Utility',
    description: 'Media player.',
    installCommand: 'pkg install mpv',
  },
  {
    id: 'sox',
    name: 'SoX',
    category: 'Utility',
    description: 'Sound processing tool.',
    installCommand: 'pkg install sox',
  },
  {
    id: 'tldr',
    name: 'TLDR Pages',
    category: 'Utility',
    description: 'Simplified man pages.',
    installCommand: 'pkg install tldr',
  },
  {
    id: 'man',
    name: 'Man Pages',
    category: 'Utility',
    description: 'System reference manuals.',
    installCommand: 'pkg install man',
  },
  {
    id: 'hexyl',
    name: 'Hexyl',
    category: 'Utility',
    description: 'Command-line hex viewer.',
    installCommand: 'pkg install hexyl',
  },
  {
    id: 'hyperfine',
    name: 'Hyperfine',
    category: 'Utility',
    description: 'Benchmarking tool.',
    installCommand: 'pkg install hyperfine',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'Utility',
    description: 'Display dialog boxes from shell.',
    installCommand: 'pkg install dialog',
  },
  {
    id: 'whiptail',
    name: 'Whiptail',
    category: 'Utility',
    description: 'Display dialog boxes (similar to dialog).',
    installCommand: 'pkg install whiptail',
  },
  {
    id: 'bc',
    name: 'BC',
    category: 'Utility',
    description: 'An arbitrary precision calculator language.',
    installCommand: 'pkg install bc',
  },
  {
    id: 'units',
    name: 'Units',
    category: 'Utility',
    description: 'Unit conversion program.',
    installCommand: 'pkg install units',
  },
  {
    id: 'qalc',
    name: 'Qalculate',
    category: 'Utility',
    description: 'Powerful calculator.',
    installCommand: 'pkg install libqalculate',
  },
  {
    id: 'zbar',
    name: 'Zbar',
    category: 'Utility',
    description: 'Bar code reader.',
    installCommand: 'pkg install zbar',
  },
  {
    id: 'qrencode',
    name: 'QR Encode',
    category: 'Utility',
    description: 'QR Code encoder.',
    installCommand: 'pkg install libqrencode',
  },
  {
    id: 'zoxide',
    name: 'Zoxide',
    category: 'System',
    description: 'A smarter cd command.',
    installCommand: 'pkg install zoxide',
  },

  // ==========================================
  // GUI & X11
  // ==========================================
  {
    id: 'x11-repo',
    name: 'X11 Repo',
    category: 'System',
    description: 'Required repository for GUI applications.',
    installCommand: 'pkg install x11-repo',
  },
  {
    id: 'xfce4',
    name: 'XFCE4',
    category: 'System',
    description: 'Lightweight Desktop Environment.',
    installCommand: 'pkg install xfce4',
  },
  {
    id: 'tigervnc',
    name: 'TigerVNC',
    category: 'System',
    description: 'VNC Server.',
    installCommand: 'pkg install tigervnc',
  },
  {
    id: 'fluxbox',
    name: 'Fluxbox',
    category: 'System',
    description: 'Window manager.',
    installCommand: 'pkg install fluxbox',
  },
  {
    id: 'openbox',
    name: 'Openbox',
    category: 'System',
    description: 'Next generation window manager.',
    installCommand: 'pkg install openbox',
  },
  {
    id: 'i3',
    name: 'i3-wm',
    category: 'System',
    description: 'Tiling window manager.',
    installCommand: 'pkg install i3',
  },
  {
    id: 'polybar',
    name: 'Polybar',
    category: 'System',
    description: 'Fast and easy-to-use status bar.',
    installCommand: 'pkg install polybar',
  },
  {
    id: 'rofi',
    name: 'Rofi',
    category: 'System',
    description: 'Window switcher/application launcher.',
    installCommand: 'pkg install rofi',
  },
  {
    id: 'dmenu',
    name: 'Dmenu',
    category: 'System',
    description: 'Dynamic menu for X.',
    installCommand: 'pkg install dmenu',
  },

  // ==========================================
  // FUN & GAMES
  // ==========================================
  {
    id: 'cmatrix',
    name: 'CMatrix',
    category: 'Utility',
    description: 'Matrix-like screen.',
    installCommand: 'pkg install cmatrix',
  },
  {
    id: 'sl',
    name: 'SL',
    category: 'Utility',
    description: 'Steam Locomotive.',
    installCommand: 'pkg install sl',
  },
  {
    id: 'figlet',
    name: 'Figlet',
    category: 'Utility',
    description: 'Large letters from text.',
    installCommand: 'pkg install figlet',
  },
  {
    id: 'toilet',
    name: 'Toilet',
    category: 'Utility',
    description: 'Colorful large characters.',
    installCommand: 'pkg install toilet',
  },
  {
    id: 'cowsay',
    name: 'Cowsay',
    category: 'Utility',
    description: 'Talking cow.',
    installCommand: 'pkg install cowsay',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    category: 'Utility',
    description: 'Random adage.',
    installCommand: 'pkg install fortune',
  },
  {
    id: 'moon-buggy',
    name: 'Moon Buggy',
    category: 'Utility',
    description: 'Drive a car on the moon.',
    installCommand: 'pkg install moon-buggy',
  },
  {
    id: 'bastet',
    name: 'Bastet',
    category: 'Utility',
    description: 'Bastard Tetris.',
    installCommand: 'pkg install bastet',
  },
  {
    id: 'ninvaders',
    name: 'NInvaders',
    category: 'Utility',
    description: 'Space Invaders clone.',
    installCommand: 'pkg install ninvaders',
  },
  {
    id: 'greed',
    name: 'Greed',
    category: 'Utility',
    description: 'Strategy game.',
    installCommand: 'pkg install greed',
  },
  {
    id: 'nsnake',
    name: 'NSnake',
    category: 'Utility',
    description: 'Classic snake game.',
    installCommand: 'pkg install nsnake',
  },
  {
    id: '2048-c',
    name: '2048',
    category: 'Utility',
    description: '2048 game in terminal.',
    installCommand: 'pkg install 2048-c',
  },
  {
    id: 'pacman4console',
    name: 'Pacman',
    category: 'Utility',
    description: 'Pacman for console.',
    installCommand: 'pkg install pacman4console',
  },
  {
    id: 'angband',
    name: 'Angband',
    category: 'Utility',
    description: 'Dungeon exploration game.',
    installCommand: 'pkg install angband',
  },
  {
    id: 'brogue',
    name: 'Brogue',
    category: 'Utility',
    description: 'Roguelike game.',
    installCommand: 'pkg install brogue',
  },
  {
    id: 'curseofwar',
    name: 'Curse of War',
    category: 'Utility',
    description: 'Fast-paced action strategy game.',
    installCommand: 'pkg install curseofwar',
  }
];

export const GUIDES: GuideItem[] = [
  {
    id: 'setup-1',
    title: 'Termux Basic Setup',
    description: 'Essential first steps to configure your Termux environment safely.',
    steps: [
      {
        title: 'Update Packages',
        content: 'Keep your system up to date with core security and stability updates. This ensures all tools run correctly.',
        command: 'pkg update && pkg upgrade'
      },
      {
        title: 'Setup Storage',
        content: 'Grant Termux permission to access your phone storage safely so you can manage your files.',
        command: 'termux-setup-storage'
      },
      {
        title: 'Install Essential Tools',
        content: 'Install core utilities like git, curl, and wget needed for downloading most scripts.',
        command: 'pkg install git curl wget -y'
      }
    ]
  },
  {
    id: 'perf-1',
    title: 'Performance & Fixes',
    description: 'Safe optimizations and common error fixes for modern Android.',
    steps: [
      {
        title: 'Fix Signal 9 (Android 12+)',
        content: 'Prevent Android from killing Termux processes in the background automatically.',
        command: 'pkg install termux-am && termux-am setup-signal-9'
      },
      {
        title: 'Optimize Repositories',
        content: 'Choose the fastest mirror for your location to speed up your package downloads.',
        command: 'termux-change-repo'
      }
    ]
  }
];

export const ERRORS: ErrorItem[] = [
  {
    id: 'err-1',
    errorTitle: 'Repository Under Maintenance',
    symptoms: 'Errors starting with "Repository is under maintenance" or 404/403 errors during pkg update.',
    solution: 'Change the repository mirror. Run the change-repo command and select a different mirror (e.g., Grimler or A1M).',
    prevention: 'termux-change-repo'
  },
  {
    id: 'err-2',
    errorTitle: 'Permission Denied',
    symptoms: 'Unable to read/write files in /sdcard or internal storage.',
    solution: 'Ensure you have granted storage permissions to the app.',
    prevention: 'termux-setup-storage'
  },
  {
    id: 'err-3',
    errorTitle: 'Package Not Found',
    symptoms: 'E: Unable to locate package [name]',
    solution: 'The package list might be outdated or the package name is incorrect. Update your lists first.',
    prevention: 'pkg update'
  },
  {
    id: 'err-4',
    errorTitle: 'Process Killed (Signal 9)',
    symptoms: 'The terminal closes unexpectedly or displays "Killed" when running heavy processes.',
    solution: 'This is usually due to Android\'s Phantom Process Killer. You may need to disable child process restrictions in developer settings (Android 12+).',
    prevention: 'adb shell settings put global settings_enable_monitor_phantom_procs false'
  },
  {
    id: 'err-5',
    errorTitle: 'Command Not Found / Typos',
    symptoms: 'No command pkge found, did you mean... OR bash: pkge: command not found',
    solution: 'This usually indicates a typo (e.g., typing "pkge" instead of "pkg"). Termux often suggests the correct command in the output.',
    prevention: 'pkg install [package_name]'
  },
  {
    id: 'err-6',
    errorTitle: 'Bad Interpreter: No such file or directory',
    symptoms: 'bash: ./script.sh: /bin/bash^M: bad interpreter: No such file or directory',
    solution: 'The script has Windows line endings (CRLF) instead of Unix (LF). Convert it using dos2unix.',
    prevention: 'dos2unix script.sh'
  },
  {
    id: 'err-7',
    errorTitle: 'GPG Error: The following signatures were invalid',
    symptoms: 'W: GPG error: ... The following signatures were invalid: EXPKEYSIG ...',
    solution: 'The repository keys are outdated. You need to reinstall the keyring package.',
    prevention: 'pkg reinstall termux-keyring && pkg update'
  },
  {
    id: 'err-8',
    errorTitle: 'Exec Format Error',
    symptoms: 'bash: ./program: cannot execute binary file: Exec format error',
    solution: 'You are trying to run a binary compiled for a different CPU architecture (e.g., x86 on ARM). Download the version matching your device architecture (usually aarch64).',
    prevention: 'uname -m'
  }
];
