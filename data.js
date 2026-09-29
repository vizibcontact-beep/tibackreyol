const THEMES = [
 {t:"Les communes de Martinique", a:["Fort-de-France|foyal,fdf","Le Lamentin|lamantin","Schœlcher|schoelcher,shoelcher","Le Robert","Le François|francois","Sainte-Marie","La Trinité|trinite","Le Marin","Sainte-Anne","Le Diamant","Les Trois-Îlets|trois ilets,3 ilets","Saint-Pierre","Sainte-Luce","Ducos","Le Vauclin","Saint-Joseph",
  "*Rivière-Pilote","*Rivière-Salée","*Le Carbet","*Case-Pilote","*Le Lorrain","*Le Gros-Morne","*Saint-Esprit","*Les Anses-d'Arlet|anse d arlet,anses arlet","*Le Morne-Rouge","*Basse-Pointe","*Le Prêcheur|precheur","*Bellefontaine",
  "**Le Marigot","**Macouba","**Ajoupa-Bouillon","**Le Morne-Vert","**Fonds-Saint-Denis|fond saint denis","**Grand'Rivière|grand riviere"]},
 {t:"Fruits qu'on trouve aux Antilles", a:["Mangue|mango","Banane|bannann","Ananas","Coco|noix de coco,koko","Goyave","Papaye","Corossol","Avocat|zaboka","Citron vert|citron,lime","Orange","Mandarine","Fruit de la passion|maracudja,maracuja,marakoudja",
  "*Pomme-cannelle|pomme cannelle","*Carambole","*Quénette|quenette,kenet","*Prune de Cythère|pomme cythere,cythere,prune cythere","*Sapotille","*Abricot pays|zabriko,abricot","*Surette|siret","*Cerise pays|acerola,cerise","*Pomme d'eau|jamalac,pomme malaka","*Tamarin","*Chadèque|chadeque,pomelo","*Fruit à pain|fruit a pain,friyapen",
  "**Caïmite|caimite,kaymit","**Pomme-liane|pomme liane","**Icaque|zikak","**Barbadine","**Groseille pays|groseille","**Pomme-rose|pomme rose","**Pois doux"]},
 {t:"Plats et douceurs créoles", a:["Colombo|kolombo","Accras|akra,acra","Boudin créole|boudin","Féroce d'avocat|feroce","Blaff","Court-bouillon|koubouyon","Fricassée de lambi|lambi","Crabe farci|crabes farcis","Pâté en pot|pate en pot","Ragoût de cochon|ragout","Chiquetaille de morue|chiquetaille","Dombrés|dombre","Gratin de christophine|christophine gratinee","Riz aux pois rouges|riz pois","Blanc-manger coco|blanc manger","Pain au beurre","Chodo","Tourment d'amour","Sorbet coco",
  "*Calalou|kalalou","*Touffé de requin|touffe requin","*Souskaï|souskai,chouskay","*Migan","*Matoutou crabe|matoutou","*Ti-nain lanmori|ti nain morue,tinain morue","*Fricassée de chatrou|chatrou","*Bébélé|bebele","*Matété|matete","*Bokit","*Doucelette","*Pâté salé|pate creole,pate cochon",
  "**Macadam","**Soupe z'habitant|soupe zabitan,soup zabitan"]},
 {t:"Marques de rhum de Martinique", a:["Clément|clement","J.M|jm","Saint-James","Trois-Rivières|3 rivieres","Depaz","Neisson","La Mauny","Dillon",
  "*HSE|habitation saint etienne,saint etienne","*La Favorite","*Bally","*Duquesne",
  "**A1710","**Le Galion|galion","**Simon|distillerie simon"]},
 {t:"Personnages des contes et légendes créoles", a:["Compère Lapin|konpe lapen,lapin,kompe lapin","Manman Dlo|maman dlo,mama dlo","Ti-Jean|ti jan,tijean","Zombi|zonbi,zombie","Soukougnan|soukouyan,soucougnan","Dorlis|dorli","Diablesse|guiablesse,djables,la diablesse","Cheval à trois pattes|chouval twa pat,chouval twapat,cheval trois pattes",
  "*Compère Zamba|zamba,konpe zanba","*Compère Tigre|konpe tig,tigre","*Bête à Man Ibé|bet a man ibe,man ibe","*Moun mò|moun mo"]},
 {t:"Plages de Martinique", stop:["anse","plage"], a:["Les Salines|grande anse des salines","Anse Mitan","Grande Anse d'Arlet|grande anse,anse arlet","Anse Noire","Anse Dufour","Le Diamant|plage du diamant","Anse Figuier","Pointe du Bout","Anse Madame","Tartane","Pointe Marin|pointe du marin","Anse Michel","Cap Chevalier",
  "*Anse Cafard|anse caffard","*Anse Trabaud","*Anse Couleuvre","*Anse Céron|ceron","*Anse Turin","*Anse l'Étang|anse etang","*Anse Dizac","*Anse Corps de Garde","*Anse Macabou","*Anse à l'Âne|anse a l ane,anse ane","*Anse Latouche",
  "**Anse Chaudière|chaudiere","**Anse Meunier","**Anse Bonneville","**Anse Charpentier"]},
 {t:"Artistes de musique antillaise", a:["Kassav'|kassav","Jocelyne Béroard|beroard","Jacob Desvarieux|desvarieux","Malavoi","Édith Lefel|lefel","Tanya Saint-Val|tanya st val","Zouk Machine","Francky Vincent","Admiral T|admiral","Kalash","Nichols","Slaï|slai","Patrick Saint-Éloi|saint eloi","Jean-Philippe Marthély|marthely","Ralph Thamar|thamar","Perle Lama","Fanny J",
  "*Eugène Mona|mona","*Alexandre Stellio|stellio","*Marius Cultier|cultier","*Kali","*Joëlle Ursull|ursull","*Gilles Floro|floro","*Thierry Cham","*Jean-Michel Rotin|rotin","*Harry Diboula|diboula","*Medhy Custos|custos","*Lieutenant","*Dédé Saint-Prix|dede saint prix",
  "**Kolo Barst|kolo","**Tony Chasseur","**Léona Gabriel|leona gabriel","**Mario Canonge|canonge"]},
 {t:"Animaux de Martinique", a:["Manicou|opossum","Mangouste","Iguane","Colibri|foufou,fou fou","Mabouya","Anolis|zandoli","Trigonocéphale|trigonocephale,fer de lance,serpent,bothrops","Crabe|crabe de terre","Tortue|tortue marine","Lambi","Oursin|chadron","Sucrier|sikriye","Chauve-souris|chauve souris","Poisson volant",
  "*Matoutou falaise|matoutou","*Pipiri","*Carouge|carouge de martinique","*Agouti|zagouti","*Ouassou","*Balaou","*Cirique|siwik","*Mantou","*Moqueur|moqueur gorge blanche","*Ravet|cafard","*Mille-pattes|bete a mille pattes,scolopendre","*Chatrou|poulpe,pieuvre",
  "**Trembleur|trembleur brun","**Colibri madère|madere","**Couresse|couresse de la martinique"]},
 {t:"Grandes figures de l'histoire martiniquaise", a:["Aimé Césaire|cesaire,aime cesaire","Frantz Fanon|fanon","Édouard Glissant|glissant","Joseph Zobel|zobel","Patrick Chamoiseau|chamoiseau","Raphaël Confiant|confiant","Euzhan Palcy|palcy","Joséphine de Beauharnais|josephine,imperatrice josephine","Paulette Nardal|nardal","Victor Schœlcher|schoelcher","Serge Letchimy|letchimy","Alfred Marie-Jeanne|marie jeanne",
  "*Suzanne Césaire","*Jane Nardal","*Pierre Aliker|aliker","*Camille Darsières|darsieres","*Cyrille Bissette|bissette","*Louis Delgrès|delgres","*Gilbert Gratiant|gratiant","*René Ménil|menil","*Jenny Alpha","*Wendie Renard|renard","*Sabine Andrivon-Milton|andrivon milton,andrivon",
  "**Mayotte Capécia|capecia","**Victor Sévère|severe","**Ronald Pognon|pognon"]},
 {t:"Fêtes, danses et traditions", a:["Carnaval|kanaval","Vaval","Bèlè|bele,bel air","Danmyé|danmye,ladja","Chanté Nwèl|chante noel,chante nwel","Tour des yoles|yole,yole ronde","Biguine|beguine","Zouk","Mazurka|mazouk,mazurka creole","Toussaint|toussaint lumiere","Lasotè|lasote,coup de main,koudmen","Kalenda","Pâques|paques","Mardi gras","Lundi gras","Mercredi des cendres|mercredi cendres","22 Mai|22 mai,abolition,fete de l abolition",
  "*Chouval bwa|chouval bois","*Haute-taille|haute taille","*Ti bwa|tibwa","*Tambour bèlè|tanbou,tambour","*Combat de coqs|pitt,pit coq,combat de coq","*Mariannes lapofig|mariann lapofig,marian lapo fig","*Vidé|vide","*Nèg gwo siwo|neg gwo siwo,negre gros sirop",
  "**Moko zombi|moko zonbi"]},
 {t:"Ingrédients de la cuisine créole", a:["Piment|piment antillais","Cive|cives","Bois d'Inde|bwa den","Poudre à colombo|colombo","Thym","Ail","Citron vert|citron","Christophine|chayotte","Igname|yam","Patate douce|patate","Fruit à pain|fruit a pain","Banane plantain|plantain","Ti-nain|ti nain,banane verte","Morue|lanmori","Lambi","Chatrou|poulpe","Ouassou","Lait de coco|coco","Pois rouges|pois","Riz","Clou de girofle|girofle","Muscade","Cannelle","Persil","Oignon pays|oignon",
  "*Dachine|madere,malanga,taro","*Pois d'Angole|pois angole,pois di bwa","*Oursin","*Bonda Man Jacques|piment bonda,bonda","*Roucou|rocou","*Gingembre","*Quatre-épices|quatre epices","*Giraumon|potiron","*Farine de manioc|manioc","*Queue de cochon|ke kochon","*Gombo",
  "**Chou caraïbe|chou caraibe","**Couac","**Balaou"]},
 {t:"Sites incontournables de Martinique", a:["Montagne Pelée|pelee,la pelee","Rocher du Diamant|rocher diamant","Jardin de Balata|balata","Habitation Clément|clement","Savane des Esclaves","Presqu'île de la Caravelle|caravelle","Château Dubuc|dubuc","Bibliothèque Schœlcher|bibliotheque schoelcher","Cathédrale Saint-Louis|cathedrale","Fort Saint-Louis","Grand Marché|marche couvert","Gorges de la Falaise|gorges falaise","Pitons du Carbet|pitons","Mémorial Cap 110|cap 110,anse caffard,memorial anse caffard","Trace des Jésuites|trace jesuites","Pointe du Bout",
  "*Saut du Gendarme|saut gendarme","*Domaine d'Émeraude|emeraude","*Cachot de Cyparis|cyparis","*Ruines du théâtre de Saint-Pierre|theatre saint pierre","*Musée de la Pagerie|pagerie","*Village de la Poterie|poterie","*Tombolo de Sainte-Marie|tombolo","*Îlet Chancel|chancel","*Fonds Blancs|baignoire de josephine,baignoires de josephine","*Canal de Beauregard|canal des esclaves,beauregard","*Habitation Céron|ceron","*Musée Paul Gauguin|gauguin","*Savane des Pétrifications|petrifications","*Morne Larcher|larcher",
  "**Fond Saint-Jacques","**Sacré-Cœur de Balata|sacre coeur","**Maison de la Canne|maison canne","**Écomusée de Martinique|ecomusee"]}
];
const ROUNDS=5;

/* ---------- Nouveaux thèmes (ajoutés à la suite pour garder les numéros des anciens) ---------- */
THEMES.push(
 {t:"Les communes de Guadeloupe", a:["Pointe-à-Pitre|pointe a pitre,pap","Les Abymes|abymes","Basse-Terre","Baie-Mahault|baie mahault","Le Gosier|gosier","Sainte-Anne","Saint-François|saint francois","Le Moule|moule","Sainte-Rose","Petit-Bourg","Lamentin","Capesterre-Belle-Eau|capesterre","Deshaies","Bouillante",
  "*Morne-à-l'Eau|morne a l eau","*Port-Louis","*Petit-Canal","*Anse-Bertrand","*Goyave","*Trois-Rivières|trois rivieres","*Saint-Claude","*Gourbeyre","*Baillif","*Vieux-Habitants","*Pointe-Noire","*Grand-Bourg","*La Désirade|desirade","*Terre-de-Haut",
  "**Vieux-Fort","**Terre-de-Bas","**Saint-Louis","**Capesterre-de-Marie-Galante|capesterre marie galante"]},
 {t:"Les communes de Guyane", a:["Cayenne","Kourou","Saint-Laurent-du-Maroni|saint laurent","Matoury","Rémire-Montjoly|remire,montjoly","Macouria","Mana","Maripasoula","Sinnamary","Saint-Georges|saint georges de l oyapock",
  "*Apatou","*Awala-Yalimapo|awala","*Iracoubo","*Montsinéry-Tonnegrande|montsinery","*Papaïchton|papaichton","*Régina|regina","*Roura","*Grand-Santi","*Camopi","*Saül|saul",
  "**Ouanary","**Saint-Élie|saint elie"]},
 {t:"Lieux de Saint-Martin et Saint-Barthélemy", stop:["anse","baie","ilet","plage"], a:["Marigot","Grand-Case","Philipsburg","Baie Orientale|orient bay","Gustavia","Saint-Jean","Maho Beach|maho","Simpson Bay","Îlet Pinel|pinel",
  "*Quartier d'Orléans|orleans,french quarter","*Sandy Ground","*Cul-de-Sac","*Anse Marcel","*Baie Nettlé|nettle","*Friar's Bay|friars bay","*Pic Paradis","*Tintamarre","*Colombier","*Lorient","*Corossol","*Flamands","*Shell Beach","*Grand Cul-de-Sac","*Grande Saline|saline",
  "**Anse du Gouverneur|gouverneur","**Toiny","**Vitet","**Petit Cul-de-Sac","**Public","**Baie Longue|long bay","**Mullet Bay","**Terres Basses"]},
 {t:"Mots créoles du quotidien (en créole)", a:["Bonjou","Bonswa","Mèsi|mesi","Manjé|manje","Dlo","Kay","Lanmè|lanme","Lapli","Solèy|soley","Zanmi","Manman","Papa","Timoun|ti moun","Bèl|bel","Wi","Travay","Dòmi|domi","Bwè|bwe","Lajan","Lari","Zwazo","Chouval","Kochon","Poul","Chyen|chien",
  "*Pyé-bwa|pye bwa","*Fwè|fwe","*Sè|se","*Tonton","*Matant","*Granmoun|gran moun","*Lékol|lekol","*Lannwit|lannuit","*Jòdi|jodi","*Dèmen|demen","*Gadé|gade","*Kouté|koute",
  "**Anmwé|anmwe","**Tjenbé rèd|tjenbe red,kenbe red","**Dousman"]},
 {t:"Sportifs nés aux Antilles et en Guyane", a:["Marie-José Pérec|perec","Lilian Thuram|thuram","Teddy Riner|riner","Laura Flessel|flessel","Christine Arron|arron","Wendie Renard|renard","Florent Malouda|malouda","Mickaël Piétrus|pietrus",
  "*Marius Trésor|tresor","*Jocelyn Angloma|angloma","*Jean-Marc Mormeck|mormeck","*Ronny Turiaf|turiaf","*Mickaël Gelabale|gelabale","*Kévin Séraphin|seraphin","*Pascal Chimbonda|chimbonda","*Ronald Pognon|pognon",
  "**Rony Martias|martias","**Kévin Parsemain|parsemain"]},
 {t:"Reptiles des Antilles et de Guyane", a:["Iguane|iguane vert,iguane commun","Anolis|zandoli","Mabouya","Trigonocéphale|trigonocephale,fer de lance,serpent,bothrops","Tortue verte","Tortue imbriquée|imbriquee,caret","Tortue luth|luth","Caïman|caiman",
  "*Iguane des Petites Antilles|iguana delicatissima,iguane petites antilles","*Couresse","*Tortue caouanne|caouanne","*Tortue charbonnière|charbonniere,molokoy","*Anaconda","*Boa|boa constricteur","*Sphérodactyle|spherodactyle",
  "**Tortue olivâtre|olivatre"]},
 {t:"Oiseaux des Antilles", a:["Colibri|foufou","Sucrier|sikriye","Pipiri","Tourterelle|tourtrelle,ortolan","Merle|quiscale","Ramier","Héron garde-bœufs|garde boeuf,pique boeuf","Aigrette","Moqueur",
  "*Colibri madère|madere","*Colibri huppé|huppe","*Carouge|oriole","*Pic de la Guadeloupe|tapeur,toto bwa","*Gros-bec|gwo bek","*Cici|sporophile","*Perdrix","*Grive à pieds jaunes|grive","*Trembleur","*Crécerelle|crecerelle,gli gli","*Héron vert",
  "**Moqueur gorge-blanche|gorge blanche","**Coulicou manioc|coulicou","**Siffleur des montagnes|siffleur"]},
 {t:"Oiseaux marins des Antilles", a:["Frégate|fregate","Pélican|pelican brun","Mouette|mouette atricille","Sterne","Fou brun|fou",
  "*Paille-en-queue|phaeton","*Noddi brun|noddi","*Fou à pieds rouges|pieds rouges","*Sterne royale","*Sterne fuligineuse","*Sterne bridée|bridee","*Puffin d'Audubon|puffin",
  "**Sterne de Dougall|dougall","**Fou masqué|masque"]},
 {t:"Poissons pélagiques des Antilles", a:["Thon|thon jaune,albacore","Daurade coryphène|daurade,dorade,coryphene,mahi mahi","Marlin|marlin bleu","Espadon","Thazard|wahoo","Poisson volant|volant","Requin","Bonite","Barracuda|becune",
  "*Balaou","*Voilier|poisson voilier","*Carangue","*Sériole|seriole","*Thon noir","*Coulirou","*Maquereau",
  "**Marlin blanc","**Listao|thon listao","**Requin océanique|requin oceanique,longimanus"]},
 {t:"Espèces de la mangrove", a:["Palétuvier rouge|paletuvier","Palétuvier noir","Palétuvier blanc","Crabe de terre|crabe","Huître de palétuvier|huitre","Héron|heron vert","Aigrette",
  "*Palétuvier gris|conocarpus","*Mantou","*Cirique|siwik","*Crabe violoniste|violoniste","*Bihoreau|bihoreau violace","*Mulet","*Tarpon","*Fougère dorée|fougere","*Raton laveur|racoon",
  "**Éponge|eponge","**Moule de mangrove|moule"]},
 {t:"Arbres, fleurs et plantes des Antilles", a:["Flamboyant","Hibiscus","Bougainvillier|bougainvillee","Balisier|heliconia","Anthurium","Alpinia","Rose porcelaine","Cocotier","Bananier","Manguier","Frangipanier",
  "*Fromager","*Mancenillier","*Raisinier bord de mer|raisinier","*Amandier pays|amandier","*Courbaril","*Gommier","*Acajou|mahogany","*Bois d'Inde","*Arbre du voyageur","*Oiseau de paradis|strelitzia","*Alamanda","*Fougère arborescente|fougere","*Calebassier","*Bambou","*Orchidée|orchidee",
  "**Bois-canon|bois canon","**Poirier pays|poirier","**Mapou"]}
);

/* ---------- « Ou té sav sa ? » (une ou deux infos par thème, dans l'ordre des thèmes) ---------- */
const ANEC=[
 ["Saint-Pierre, détruite par l'éruption de la montagne Pelée le 8 mai 1902, était alors la capitale économique de la Martinique.","Grand'Rivière est la commune la plus au nord de la Martinique, au bout de la route du nord-atlantique."],
 ["Le corossol et la pomme-cannelle appartiennent à la même famille de plantes, les Annonacées.","Le fruit à pain a été introduit aux Antilles à la fin du XVIIIe siècle pour nourrir les populations des habitations."],
 ["Le chodo, boisson chaude à base de lait, d'œufs et d'épices, est servi lors des communions et des baptêmes.","Selon la tradition, le blaff tire son nom du bruit du poisson plongé dans le bouillon."],
 ["Le rhum agricole de Martinique bénéficie d'une AOC depuis 1996 : c'est le seul rhum au monde à en avoir une."],
 ["Les contes créoles se disaient la nuit, pendant les veillées. Le conteur lançait « Yé krik ! » et l'assistance répondait « Yé krak ! »."],
 ["Le sable noir des plages du nord, comme l'Anse Céron ou l'Anse Couleuvre, vient des roches volcaniques de la montagne Pelée."],
 ["Le groupe Kassav', fondé en 1979, a fait connaître le zouk dans le monde entier.","La biguine est née à Saint-Pierre à la fin du XIXe siècle."],
 ["Dans les Antilles françaises, le trigonocéphale ne vit qu'en Martinique : il est absent de la Guadeloupe.","La mangouste a été introduite à la fin du XIXe siècle pour lutter contre les serpents et les rats."],
 ["Aimé Césaire a été maire de Fort-de-France pendant 56 ans, de 1945 à 2001.","À Paris, le salon littéraire de Paulette Nardal et de ses sœurs a nourri le mouvement de la Négritude."],
 ["Les savoir-faire liés à la yole ronde de Martinique sont inscrits au patrimoine culturel immatériel de l'UNESCO depuis 2020."],
 ["Le bois d'Inde est de la même famille que le giroflier : ses feuilles parfument le blaff et le court-bouillon."],
 ["La montagne Pelée, avec ses 1 397 mètres, est le point culminant de la Martinique."],
 ["Vue du ciel, la Guadeloupe a la forme d'un papillon : Basse-Terre à l'ouest, Grande-Terre à l'est, séparées par la Rivière Salée.","La Soufrière, en Guadeloupe, est le point culminant des Petites Antilles."],
 ["Avec plus de 83 000 km², la Guyane est la plus grande région de France.","Le Centre spatial guyanais, d'où décollent les fusées européennes, se trouve à Kourou."],
 ["Depuis le traité de Concordia de 1648, l'île de Saint-Martin est partagée entre la France au nord et les Pays-Bas au sud.","Gustavia doit son nom au roi Gustave III : Saint-Barthélemy a été suédoise de 1784 à 1878."],
 ["Le créole martiniquais s'écrit le plus souvent selon la graphie élaborée par le GEREC, le groupe de recherche fondé par Jean Bernabé."],
 ["Marie-José Pérec, née à Basse-Terre, a remporté trois titres olympiques, en 1992 et 1996.","Teddy Riner, né aux Abymes, est l'un des judokas les plus titrés de l'histoire."],
 ["L'iguane des Petites Antilles est menacé, notamment par l'hybridation avec l'iguane commun introduit dans les îles."],
 ["Le moqueur gorge-blanche ne vit qu'en Martinique, sur la presqu'île de la Caravelle, et à Sainte-Lucie.","Le pic de la Guadeloupe, appelé tapeur, ne vit nulle part ailleurs qu'en Guadeloupe."],
 ["La frégate ne peut pas se poser sur l'eau : ses plumes ne sont pas imperméables. Elle vole souvent leurs proies aux autres oiseaux."],
 ["Pour pêcher thons et daurades au large, les pêcheurs antillais utilisent des DCP, des dispositifs qui attirent les poissons."],
 ["La mangrove protège le littoral de l'érosion et sert de nurserie à de nombreux poissons.","Le palétuvier rouge se tient sur ses racines-échasses, qui l'ancrent dans la vase."],
 ["Le mancenillier, arbre des plages, est très toxique : il ne faut jamais s'abriter dessous quand il pleut.","Le fromager est un arbre imposant, entouré de nombreuses croyances dans les traditions antillaises."]
];
const PROVERBS=[
 ["Dousman pa anpéché rivé.","Aller doucement n'empêche pas d'arriver."],
 ["Sé grenn diri ki fè sak diri.","C'est grain de riz par grain de riz qu'on remplit le sac."],
 ["Bèf pa janmen di savann mèsi.","Le bœuf ne dit jamais merci à la savane."],
 ["Sé kouto sèl ki sav sa ki an tjè joumou.","Seul le couteau sait ce qu'il y a dans le cœur du giraumon."],
 ["Tout bèl dan pa di zanmi.","Un beau sourire ne veut pas dire amitié."],
 ["Chyen pa ka fè chat.","Un chien ne fait pas des chats."],
 ["Sa ki ta'w, larivyè pa ka chayé'y.","Ce qui est à toi, la rivière ne l'emportera pas."],
 ["Ravèt pa janmen ni rézon douvan poul.","Le ravet n'a jamais raison devant la poule."]
];

/* ---------- Territoires ---------- */
const TERRS=[['MQ','Martinique'],['GP','Guadeloupe'],['GF','Guyane'],['SM','Saint-Martin'],['SB','Saint-Barthélemy']];
const TERR_NAME={MQ:'Martinique',GP:'Guadeloupe',GF:'Guyane',SM:'Saint-Martin',SB:'Saint-Barthélemy',AN:'Antilles-Guyane'};
['MQ','AN','AN','MQ','AN','MQ','AN','MQ','MQ','AN','AN','MQ','GP','GF','SM','AN','AN','AN','AN','AN','AN','AN','AN'].forEach((t,i)=>{THEMES[i].terr=t;});
[2,9,10,14].forEach(i=>{THEMES[i].off=true;}); // remplacés par des thèmes plus précis (gardés pour les parties déjà créées)

/* Noms vernaculaires : plusieurs espèces de crabes acceptées */
THEMES[7].a=THEMES[7].a.map(s=>s==='Crabe|crabe de terre'?'Crabe de terre|crabe,crabe blanc':s).concat(['*Touloulou|tourlourou,crabe rouge','*Bernard-l\'ermite|bernard l hermite,soldat,solda']);
THEMES[21].a=THEMES[21].a.map(s=>s==='Crabe de terre|crabe'?'Crabe de terre|crabe,crabe blanc,cardisome':s).concat(['*Touloulou|tourlourou,crabe rouge','*Bernard-l\'ermite|bernard l hermite,soldat,solda']);

function T(terr,t,a,anec,stop){THEMES.push({terr,t,a,stop});ANEC[THEMES.length-1]=anec||[];}

/* --- Cuisine --- */
T('AN',"Plats créoles",["Colombo|kolombo,colombo cabri,colombo poulet","Accras|akra,acra","Boudin créole|boudin","Féroce d'avocat|feroce","Blaff","Court-bouillon|koubouyon","Fricassée de lambi|lambi","Crabes farcis|crabe farci","Pâté en pot|pate en pot","Ragoût de cochon|ragout","Chiquetaille de morue|chiquetaille","Dombrés|dombre","Riz aux pois rouges|riz pois","Gratin de christophine|christophine gratinee",
 "*Calalou|kalalou","*Touffé de requin|touffe requin","*Souskaï|souskai,chouskay","*Migan","*Matoutou crabe|matoutou","*Ti-nain lanmori|ti nain morue","*Fricassée de chatrou|chatrou","*Bébélé|bebele","*Matété|matete","*Bokit","*Poulet boucané|boucane","*Fricassée de ouassous|ouassou",
 "**Macadam","**Soupe z'habitant|soupe zabitan","**Bouillon d'awara|awara","**Soupe à Congo|soupe congo"],
 ["Le bouillon d'awara, plat de Pâques en Guyane, cuit pendant des heures. Un dicton dit que celui qui en mange revient toujours en Guyane."]);
T('AN',"Pâtisseries et desserts créoles",["Tourment d'amour","Pain au beurre","Gâteau patate|gateau patate douce","Flan coco","Blanc-manger coco|blanc manger","Sorbet coco","Tarte coco|tarte a la noix de coco","Gâteau banane",
 "*Sispa","*Pain patate","*Cassave|kassav","*Bonbon lanmidon|lanmidon","*Pain doux","*Gâteau coco",
 "**Pain au beurre à l'ancienne","**Gâteau manioc|gateau de manioc"],
 ["Le tourment d'amour est la spécialité des Saintes, en Guadeloupe. On raconte que les femmes de marins le préparaient en attendant leur retour."]);
T('AN',"Confiseries créoles",["Doucelette","Sucre à coco|sukakoko,suka koko","Tablette coco|tablette","Pomme d'amour","Nougat pistache|nougat",
 "*Kilibibi","*Pistache grillée|pistache","*Chadèque confite|chadeque confite,chadeque","*Coco sec",
 "**Confiture de goyave|goyave"],
 ["Aux Antilles, on appelle « pistache » la cacahuète : le nougat pistache est donc un nougat de cacahuètes."]);
T('AN',"Légumes et tubercules des Antilles",["Igname|yam","Dachine|madere,taro","Patate douce|patate","Christophine|chayotte","Giraumon|potiron","Gombo","Fruit à pain","Banane plantain|plantain","Ti-nain|ti nain,poyo,banane verte","Manioc","Pois rouges|pois","Concombre","Tomate",
 "*Malanga|chou caraibe","*Pois d'Angole|pois angole,pois di bwa","*Bélangère|belangere,aubergine","*Couscouche","*Haricots verts|haricot","*Laitue|salade","*Chou",
 "**Topinambour pays|topi tambou,topitambou","**Pois boukousou|boukousou"],
 ["L'igname fait partie des plats traditionnels de Noël aux Antilles, avec le jambon et les pois d'Angole."]);
T('AN',"Épices et aromates de la cuisine créole",["Piment","Bois d'Inde|bwa den","Cive|cives","Thym","Persil","Ail","Oignon pays|oignon","Poudre à colombo|colombo","Gingembre","Muscade","Cannelle","Clou de girofle|girofle","Vanille",
 "*Bonda Man Jacques|piment bonda,bonda","*Curcuma|safran pays,safran","*Quatre-épices|quatre epices","*Roucou|rocou","*Chadron béni|chadron beni,coriandre","*Cumin","*Poivre","*Massalé|massale",
 "**Fenugrec","**Laurier"],
 ["La poudre à colombo, mélange d'épices arrivé avec les travailleurs indiens au XIXe siècle, donne son nom au célèbre plat."]);
T('AN',"Fruits de mer et coquillages",["Lambi","Chatrou|poulpe,pieuvre","Langouste","Ouassou","Crevette","Oursin|chadron","Crabe","Burgau|burgot",
 "*Z'habitant|zabitan,ecrevisse","*Cirique|siwik","*Soudon|soudons","*Huître de palétuvier|huitre","*Calmar|encornet,chipiron","*Palourde","*Cigale de mer|cigale",
 "**Vignot|vignots","**Casque"],
 ["Pour protéger l'espèce, la pêche de l'oursin blanc (chadron) est interdite une grande partie de l'année aux Antilles."]);
T('AN',"Boissons et cocktails antillais",["Ti-punch|ti punch,tipunch","Planteur","Punch coco","Jus de canne|vesou","Rhum vieux","Chodo","Shrubb|schrubb,chrubb","Jus de groseille|groseille","Jus de maracudja|maracudja,jus de maracuja",
 "*Mabi|maby","*Punch passion","*Chocolat pays|chocolat de communion","*Bois bandé|bois bande","*Jus de goyave","*Didiko","*Lorraine|biere lorraine",
 "**Punch tamarin","**Liqueur de coco"],
 ["Le shrubb, liqueur de rhum aux écorces d'orange, est la boisson des fêtes de fin d'année en Martinique."]);

/* --- Plages, rivières, reliefs, quartiers --- */
T('GP',"Plages de Guadeloupe",["Grande Anse|grande anse deshaies","La Datcha|datcha","Bois Jolan","Plage de la Caravelle|caravelle","Malendure","Anse Laborde|laborde","Porte d'Enfer","Raisins Clairs","Plage de Clugny|clugny","Petit-Havre|petit havre",
 "*Anse Tarare|tarare","*Anse à la Barque|anse a la barque","*Anse Maurice","*L'Autre Bord|autre bord","*Anse Canot|canot","*La Feuillère|feuillere","*Petite Anse","*Pompierre","*Grande Anse de Trois-Rivières|grande anse trois rivieres",
 "**Anse Crawen|crawen","**Plage de Viard|viard"],
 ["La plage de Malendure, à Bouillante, fait face à la réserve Cousteau, célèbre pour ses fonds marins."],["anse","plage"]);
T('SM',"Plages de Saint-Martin",["Baie Orientale|orient bay","Grand-Case","Baie Longue|long bay","Baie Rouge","Friar's Bay|friars bay","Îlet Pinel|pinel","Maho Beach|maho","Mullet Bay",
 "*Happy Bay","*Anse Marcel","*Baie Nettlé|nettle","*Plage du Galion|galion","*Cupecoy","*Dawn Beach|dawn","*Simpson Bay",
 "**Baie aux Prunes|plum bay","**Guana Bay"],
 ["À Maho Beach, côté hollandais, les avions passent quelques mètres au-dessus des baigneurs pour atterrir."],["anse","baie","ilet","plage"]);
T('SB',"Plages de Saint-Barthélemy",["Saint-Jean","Flamands","Colombier","Gouverneur","Grande Saline|saline","Shell Beach","Lorient",
 "*Grand Cul-de-Sac","*Petit Cul-de-Sac","*Toiny","*Anse des Cayes|cayes","*Marigot","*Corossol","*Grand Fond",
 "**Anse de Lurin|lurin"],
 ["La plage de Colombier n'est accessible qu'à pied, par un sentier, ou en bateau."],["anse","baie","plage"]);
T('MQ',"Rivières de Martinique",["Lézarde|lezarde","Rivière Capot|capot","Rivière Blanche|blanche","Rivière du Lorrain|lorrain","Rivière Madame|madame","Rivière Salée|salee","Rivière Pilote|pilote","Roxelane","Rivière du Galion|galion","Rivière du Carbet|carbet",
 "*Rivière Monsieur|monsieur","*Rivière Falaise|falaise","*Rivière Case-Navire|case navire","*Rivière du Prêcheur|precheur","*Rivière des Pères|peres","*Rivière Sèche|seche","*Grande Rivière",
 "**Rivière Jambette|jambette","**Rivière La Manche|la manche"],
 ["La Lézarde est la plus longue rivière de Martinique : elle descend des Pitons du Carbet jusqu'à la baie de Fort-de-France."],["riviere"]);
T('GP',"Rivières de Guadeloupe",["Grande Rivière à Goyaves|riviere a goyaves,goyaves","Rivière Salée|salee","Rivière du Grand Carbet|grand carbet,carbet","Rivière aux Herbes|aux herbes","Rivière du Galion|galion","Rivière Corossol|corossol","Rivière Moustique|moustique",
 "*Rivière de la Lézarde|lezarde","*Rivière Sens|sens","*Rivière des Pères|peres","*Rivière Bananier|bananier","*Grande Rivière de Vieux-Habitants|vieux habitants","*Rivière Bras-David|bras david",
 "**Rivière Beaugendre|beaugendre","**Rivière Noire|noire"],
 ["La Grande Rivière à Goyaves est le plus long cours d'eau de Guadeloupe."],["riviere","grande"]);
T('GF',"Fleuves et rivières de Guyane",["Maroni","Oyapock","Approuague","Mana","Sinnamary","Kourou","Comté|comte","Mahury",
 "*Iracoubo","*Organabo","*Counamama","*Litani","*Lawa","*Camopi","*Tampok","*Inini",
 "**Orapu","**Kaw"],
 ["Le Maroni marque la frontière entre la Guyane et le Suriname ; l'Oyapock, celle avec le Brésil."],["fleuve","riviere"]);
T('AN',"Cascades et sauts des Antilles et de Guyane",["Chutes du Carbet|carbet","Saut du Gendarme|gendarme","Cascade aux Écrevisses|ecrevisses","Saut de la Lézarde|lezarde","Cascade Didier|didier","Gorges de la Falaise|falaise",
 "*Saut d'Acomat|acomat","*Cascade Couleuvre|couleuvre","*Cascade Absalon|absalon","*Saut Babin|babin","*Chutes du Galion|galion","*Cascade Vauchelet|vauchelet",
 "**Saut des Trois Cornes|trois cornes","**Saut Maman Valentin|maman valentin"],
 ["Les Chutes du Carbet, en Guadeloupe, sont parmi les plus hautes cascades des Petites Antilles."],["cascade","chute","saut"]);
T('MQ',"Mornes, pitons et montagnes de Martinique",["Montagne Pelée|pelee","Pitons du Carbet|pitons","Morne Jacob|jacob","Morne Larcher|larcher","Montagne du Vauclin|vauclin","Morne Rouge",
 "*Piton Lacroix|lacroix","*Piton Boucher|boucher","*Piton Dumauzé|dumauze","*Piton de l'Alma|alma","*Morne des Esses|esses","*Morne Pitault|pitault","*Morne Vert",
 "**Morne Pichevin|pichevin","**Morne Chapeau Nègre|chapeau negre"],
 ["Les Pitons du Carbet sont d'anciens volcans ; le piton Lacroix, leur sommet, dépasse les 1 190 mètres."],["morne","piton","montagne"]);
T('MQ',"Anses et baies de Martinique",["Baie de Fort-de-France|fort de france","Baie du Robert|robert","Baie du François|francois","Baie du Marin|marin","Baie de Saint-Pierre|saint pierre","Anse Mitan","Anse Noire","Anse Dufour","Anse Cafard|caffard",
 "*Baie du Trésor|tresor","*Baie des Anglais|anglais","*Baie du Galion|galion","*Baie de Génipa|genipa","*Anse Figuier","*Anse Céron|ceron","*Anse Couleuvre","*Anse Trabaud",
 "**Cul-de-sac du Marin|cul de sac marin","**Anse Macabou","**Anse Dizac"],
 ["La baie du Trésor, sur la presqu'île de la Caravelle, abrite l'une des mangroves les mieux préservées de Martinique."],["anse","baie"]);
T('MQ',"Quartiers de Fort-de-France",["Terres-Sainville|terres sainville","Trénelle|trenelle","Sainte-Thérèse|sainte therese","Volga-Plage|volga","Texaco","Bellevue","Didier","Redoute","Balata","Dillon","Pointe-Simon|pointe simon",
 "*Clairière|clairiere","*Cluny","*Floréal|floreal","*Châteauboeuf|chateauboeuf,chateau boeuf","*Bord de Canal|bo kannal,canal alaric","*Tivoli","*Ermitage","*Morne Pichevin|pichevin","*Citron","*Rive Droite",
 "**Coridon","**Godissard","**Moutte","**Desclieux","**Rivière-Roche|riviere roche","**Ravine Vilaine","**Pointe des Nègres|pointe des negres"],
 ["Le quartier Texaco doit son nom à l'ancienne installation pétrolière ; Patrick Chamoiseau en a tiré son roman Texaco, prix Goncourt 1992."]);
T('SM',"Quartiers et lieux de Saint-Martin",["Marigot","Grand-Case","Quartier d'Orléans|orleans,french quarter","Sandy Ground","Philipsburg","Simpson Bay","Baie Orientale|orient bay","Cul-de-Sac",
 "*Concordia","*Hope Estate","*Rambaud","*Terres Basses","*Anse Marcel","*Baie Nettlé|nettle","*Oyster Pond","*Cole Bay","*Pic Paradis","*Colombier","*Mont Vernon",
 "**Galisbay","**Agrément|agrement","**Saint-James"],
 ["L'île de Saint-Martin est partagée entre la France au nord et les Pays-Bas au sud depuis le traité de Concordia de 1648."],["anse","baie"]);
T('SB',"Quartiers et lieux de Saint-Barthélemy",["Gustavia","Saint-Jean","Lorient","Corossol","Flamands","Colombier","Public","Grand Cul-de-Sac",
 "*Vitet","*Toiny","*Petit Cul-de-Sac","*Marigot","*Grand Fond","*Lurin","*Saline|grande saline","*Gouverneur",
 "**Anse des Cayes|cayes","**Camaruche","**Merlette"],
 ["Gustavia doit son nom au roi Gustave III : Saint-Barthélemy a été suédoise de 1784 à 1878."],["anse","baie"]);

/* --- Patrimoine --- */
T('MQ',"Monuments et bâtiments historiques de Martinique",["Bibliothèque Schœlcher|bibliotheque schoelcher","Cathédrale Saint-Louis|cathedrale","Fort Saint-Louis","Fort Desaix|desaix","Château Dubuc|dubuc","Sacré-Cœur de Balata|sacre coeur","Ruines du théâtre de Saint-Pierre|theatre saint pierre","Cachot de Cyparis|cyparis","Habitation Clément|clement","Mémorial Cap 110|cap 110,anse caffard",
 "*Habitation Céron|ceron","*Canal de Beauregard|beauregard,canal des esclaves","*Phare de la Caravelle|phare","*Moulin de Val d'Or|val d or","*Habitation Saint-Étienne|saint etienne","*Théâtre municipal de Fort-de-France|theatre municipal","*Palais de justice de Fort-de-France|palais de justice","*Pont de l'Alma|alma",
 "**Habitation Anse Latouche|anse latouche","**Cathédrale du Mouillage|mouillage"],
 ["La bibliothèque Schœlcher a été construite pour l'Exposition universelle de Paris de 1889, démontée puis remontée pièce par pièce à Fort-de-France."]);
T('MQ',"Musées et lieux culturels de Martinique",["Musée de la Pagerie|pagerie","Musée Paul Gauguin|gauguin","Musée Frank A. Perret|perret,musee vulcanologique","Maison de la Canne|maison canne","Écomusée de Martinique|ecomusee","Fondation Clément|clement","Tropiques Atrium|atrium","Bibliothèque Schœlcher|bibliotheque schoelcher",
 "*Musée départemental d'archéologie|archeologie","*Musée régional d'histoire et d'ethnographie|ethnographie","*Musée du Rhum Saint-James|musee du rhum","*Musée de la Banane|banane","*Centre de découverte des sciences de la Terre|sciences de la terre",
 "**Savane des Esclaves","**Habitation Clément|domaine clement"],
 ["Le musée de la Pagerie, aux Trois-Îlets, occupe le domaine natal de Joséphine de Beauharnais."]);
T('GP',"Sites et monuments de Guadeloupe",["Mémorial ACTe|memorial acte,macte","La Soufrière|soufriere","Chutes du Carbet|carbet","Pointe des Châteaux|pointe des chateaux","Fort Delgrès|delgres","Fort Napoléon|napoleon","Porte d'Enfer","Place de la Victoire",
 "*Fort Fleur d'Épée|fleur d epee","*Musée Saint-John Perse|saint john perse","*Musée Schœlcher|musee schoelcher","*Musée Edgar Clerc|edgar clerc","*Habitation Zévallos|zevallos","*Habitation Murat|murat","*Cimetière de Morne-à-l'Eau|cimetiere","*Allée Dumanoir|dumanoir","*Jardin botanique de Deshaies|jardin botanique","*Marché Saint-Antoine|saint antoine","*Aquarium de Guadeloupe|aquarium",
 "**Pointe de la Grande Vigie|grande vigie","**Cathédrale de Basse-Terre|notre dame de guadeloupe"],
 ["Le Mémorial ACTe, à Pointe-à-Pitre, est un centre consacré à la mémoire de la traite et de l'esclavage, inauguré en 2015."]);
T('GF',"Sites et monuments de Guyane",["Centre spatial guyanais|centre spatial,csg","Îles du Salut|iles du salut","Île du Diable|ile du diable","Camp de la Transportation|transportation","Marais de Kaw|kaw","Place des Palmistes|palmistes","Fort Cépérou|ceperou","Marché de Cayenne",
 "*Île Royale|ile royale","*Île Saint-Joseph|saint joseph","*Musée des Cultures guyanaises|cultures guyanaises","*Musée Alexandre-Franconie|franconie","*Réserve des Nouragues|nouragues","*Parc amazonien|parc amazonien de guyane","*Mont Grand Matoury|grand matoury","*Bagne des Annamites|annamites","*Village Cacao|cacao","*Plage des Hattes|hattes",
 "**Réserve Trésor|tresor","**Montagne des Singes|singes"],
 ["Le bagne de Guyane a fonctionné de 1852 à 1953 ; Alfred Dreyfus fut détenu sur l'île du Diable."]);

/* --- Société et culture --- */
T('MQ',"Personnalités martiniquaises contemporaines",["Patrick Chamoiseau|chamoiseau","Raphaël Confiant|confiant","Euzhan Palcy|palcy","Serge Letchimy|letchimy","Alfred Marie-Jeanne|marie jeanne","Jocelyne Béroard|beroard","Wendie Renard|renard","Kalash",
 "*Ralph Thamar|thamar","*Jean-Philippe Marthély|marthely","*Tony Chasseur","*Mario Canonge|canonge","*Sabine Andrivon-Milton|andrivon milton,andrivon","*Laurent Valère|valere","*Lucien Jean-Baptiste|jean baptiste","*Ronny Turiaf|turiaf",
 "**Nicole Cage|cage","**Medhy Custos|custos"],
 ["Le Mémorial Cap 110, à l'Anse Caffard, est l'œuvre du sculpteur martiniquais Laurent Valère."]);
T('AN',"Métiers traditionnels des Antilles",["Pêcheur|marin pecheur","Coupeur de canne|koupe kann","Amarreuse","Marchande|machann","Charbonnier","Potier","Vannier","Couturière|couturiere","Blanchisseuse","Forgeron",
 "*Charbonnière|charbonniere","*Tonnelier","*Ébéniste|ebeniste","*Charpentier de marine|constructeur de yoles","*Djobeur","*Maître sucrier|sucrier","*Distillateur","*Cordonnier","*Tailleur de pierre",
 "**Raccommodeur de filets|filets","**Tresseuse de bakoua|bakoua"],
 ["Les amarreuses attachaient en paquets les cannes coupées par les coupeurs, lors de la récolte."]);
T('AN',"Objets et ustensiles créoles",["Coui|kwi","Canari|kannari","Pilon|mortier","Coutelas","Bakoua","Panier|panye","Lampe à pétrole|lampe a petrole","Fer à charbon|fer a repasser","Calebasse|kalbas",
 "*Râpe à manioc|grage,graj","*Platine","*Tamis","*Balai coco","*Trè|tre","*Dame-jeanne|dame jeanne","*Jarre","*Bonm|bomb,boite",
 "**Mouchoir madras|madras","**Moulin à café|moulin"],
 ["Le coui, moitié de calebasse séchée, servait de bol, de louche ou de récipient pour l'eau."]);
T('AN',"Jours fériés aux Antilles et en Guyane",["Jour de l'an|1er janvier,nouvel an","Lundi de Pâques|paques","Fête du Travail|1er mai","8 mai|victoire 1945","Ascension","Lundi de Pentecôte|pentecote","14 juillet|fete nationale","15 août|assomption","Toussaint|1er novembre","11 novembre|armistice","Noël|noel,25 decembre",
 "*22 mai|abolition martinique","*27 mai|abolition guadeloupe","*10 juin|abolition guyane","*Vendredi saint","*21 juillet|fete victor schoelcher,victor schoelcher","*Mardi gras","*Mercredi des cendres",
 "**9 octobre|abolition saint barthelemy","**Lundi gras"],
 ["Chaque territoire fête l'abolition de l'esclavage à sa date : 22 mai en Martinique, 27 mai en Guadeloupe, 10 juin en Guyane."]);
T('AN',"Groupes de musique antillaise",["Kassav'|kassav","Malavoi","Zouk Machine","La Perfecta|perfecta","Les Aiglons|aiglons","Taxikréol|taxikreol","Experience 7|experience sept",
 "*Akiyo","*Voukoum","*Tanbou Bô Kannal|tanbou bo kannal","*Les Vikings de Guadeloupe|vikings","*Soft","*Sakiyo"],
 ["Kassav' a été fondé en 1979 par Pierre-Édouard Décimus et Jacob Desvarieux."]);
T('AN',"Chansons créoles (titres)",["Zouk la sé sèl médikaman nou ni|zouk la se sel medikaman","Syé bwa|sye bwa","Kolé séré|kole sere","Adieu foulards, adieu madras|adieu madras,adieu foulards","Laisse parler les gens","Maldon",
 "*Siwo","*Mwen malad aw|mwen malad","*Ban mwen an ti bo|ban mwen an ti bo","*Pa bizwen palé|pa bizwen pale","*Tjenbé rèd pa moli|tchimbe red,kenbe red"],
 ["« Adieu foulards, adieu madras » est l'une des plus anciennes chansons créoles connues ; elle remonte au XVIIIe ou XIXe siècle."]);
T('AN',"Instruments de musique traditionnels",["Tanbou bèlè|tambour bele,tanbou","Ti bwa|tibwa","Chacha|cha cha","Ka|tambour ka,gwo ka","Conque de lambi|kon lanbi,conque","Accordéon|accordeon","Violon","Clarinette","Banjo","Triangle",
 "*Boula","*Makè|make","*Siyak","*Tanbou di bas|tambour di bas","*Toutoun bambou|toutoun","*Maracas",
 "**Grage|graj","**Bwa pwèl|bwa pwel"],
 ["Dans le bèlè, le ti bwa, deux baguettes frappées sur le flanc du tambour, donne la cadence au tanbouyé."]);
T('AN',"Carnaval : personnages et costumes",["Vaval","Diab Rouj|diable rouge,diab","Mariann Lapofig|mariann lapo fig,lapofig","Moko Zonbi|moko zombi","Bwa Bwa|bwabwa","Touloulou","Nèg gwo siwo|neg gwo siwo","Guiablesse|diablesse,djablès","Papa Diab|papa diable",
 "*Karolin zyé koki|caroline zie coki,karolin","*Ti Diab|ti diable","*Mas a Kongo|mas a congo","*Mas a lanmò|mas a lanmo","*Mas a kòn|mas a kon","*Jé farine|je farine","*Zonbi baréyé|zombi bareye",
 "**Mas a goudwon|mas a goudron"],
 ["Le mercredi des cendres, les carnavaliers s'habillent en noir et blanc, en diables et diablesses, pour brûler Vaval."]);
T('AN',"Genres musicaux antillais",["Zouk","Biguine","Mazurka créole|mazurka","Bèlè|bele","Gwoka","Kompa|konpa","Bouyon","Shatta","Dancehall","Reggae","Soca","Calypso","Zouk love",
 "*Kadans|cadence","*Kasékò|kaseko","*Aléké|aleke","*Valse créole|valse","*Léwòz|lewoz","*Kalenda","*Haute-taille|haute taille","*Chouval bwa|chouval bois","*Jazz caribéen|jazz",
 "**Cadence-lypso|cadence lypso"],
 ["Le gwoka de Guadeloupe est inscrit au patrimoine culturel immatériel de l'UNESCO depuis 2014."]);
T('AN',"Films tournés aux Antilles",["Rue Cases-Nègres|rue cases negres","Meurtres au paradis|death in paradise","Tropiques criminels","Nèg Maron|neg maron",
 "*Siméon|simeon","*Aliker","*Sucre amer","*Coco la fleur, candidat|coco la fleur"],
 ["Rue Cases-Nègres, d'Euzhan Palcy (1983), adapte le roman de Joseph Zobel et a reçu le Lion d'argent à Venise."]);
T('AN',"Danses traditionnelles",["Bèlè|bele","Danmyé|danmye,ladja","Biguine","Mazurka|mazouk","Quadrille","Kalenda","Gwoka|lewoz","Zouk","Haute-taille|haute taille",
 "*Grajé|graje","*Kasékò|kaseko","*Aléké|aleke","*Valse créole|valse","*Gran bèlè|gran bele","*Lalin klè|lalin kle",
 "**Kutumba"],
 ["Le danmyé, ou ladja, est un art martial dansé au son du tambour bèlè."]);
T('AN',"Fêtes et traditions",["Carnaval|kanaval","Chanté Nwèl|chante noel,chante nwel","Toussaint|toussaint lumiere","Pâques|paques,crabe de paques","Tour des yoles|yoles","Fête patronale|fete patronale","Mardi gras","Mercredi des cendres","Réveillon|reveillon",
 "*Fête des cuisinières|fete des cuisinieres,cuisinieres","*Mi-Carême|mi careme","*Lasotè|lasote,coup de main,koudmen","*Combat de coqs|pitt,combat de coq","*Veillée|veillee mortuaire","*Dimanche gras",
 "**Chanté Nwèl lakou|lakou"],
 ["La Fête des cuisinières, à Pointe-à-Pitre, rend hommage chaque mois d'août à saint Laurent, patron des cuisinières."]);

/* --- Nature --- */
T('AN',"Espèces endémiques des Antilles",["Trigonocéphale|trigonocephale,fer de lance,bothrops","Pic de la Guadeloupe|tapeur,toto bwa","Iguane des Petites Antilles|iguana delicatissima","Oriole de Martinique|carouge","Anolis de Martinique|anolis roquet","Matoutou falaise|matoutou",
 "*Moqueur gorge-blanche|gorge blanche","*Colibri madère|madere","*Trembleur brun|trembleur","*Siffleur des montagnes|siffleur","*Couresse de la Martinique|couresse","*Hylode de la Martinique|hylode",
 "**Rat pilori|pilori"],
 ["Le rat pilori, grand rongeur endémique de Martinique, a disparu après l'éruption de la montagne Pelée en 1902."]);
T('AN',"Animaux de la mer des Caraïbes",["Baleine à bosse|baleine","Cachalot","Dauphin","Tortue marine|tortue","Requin","Raie","Mérou|merou","Poisson-perroquet|perroquet","Barracuda|becune","Murène|murene","Poulpe|chatrou","Langouste","Lambi",
 "*Poisson-lion|rascasse volante","*Raie manta|manta","*Raie léopard|raie aigle","*Requin nourrice","*Poisson-coffre|coffre","*Hippocampe","*Chirurgien|poisson chirurgien","*Globicéphale|globicephale","*Lamantin",
 "**Orque","**Poisson-ange|poisson ange","**Balaou"],
 ["Les baleines à bosse viennent chaque hiver dans les eaux des Antilles pour se reproduire et mettre bas."]);
T('AN',"Coraux et organismes marins",["Corail|corail cerveau","Éponge|eponge","Gorgone|eventail de mer","Anémone|anemone","Oursin","Étoile de mer|etoile","Méduse|meduse","Herbier|herbe a tortue",
 "*Corail corne d'élan|corne d elan","*Corail corne de cerf|corne de cerf","*Corail de feu|millepora","*Concombre de mer|holothurie","*Physalie|galere portugaise","*Sargasse|sargasses","*Oursin diadème|diademe",
 "**Ascidie","**Zoanthaire"],
 ["Les sargasses, algues brunes flottantes, s'échouent en masse sur les côtes antillaises depuis 2011."]);
T('AN',"Crustacés des Antilles",["Crabe de terre|crabe blanc,cardisome","Touloulou|tourlourou,crabe rouge","Cirique|siwik,crabe nageur","Mantou","Langouste","Ouassou","Crevette","Bernard-l'ermite|bernard l hermite,soldat,solda",
 "*Z'habitant|zabitan,ecrevisse","*Crabe violoniste|violoniste","*Cigale de mer|cigale","*Crabe honteux|honteux","*Crabe araignée|araignee de mer","*Bouc|crevette bouc",
 "**Balane|balanes"],
 ["À Pâques, le matoutou de crabe se prépare avec des crabes de terre gardés et nourris plusieurs jours avant d'être cuisinés."]);
T('AN',"Mollusques des Antilles",["Lambi|strombe","Chatrou|poulpe,pieuvre","Burgau|burgot","Calmar|encornet","Huître de palétuvier|huitre","Soudon|soudons","Escargot",
 "*Vignot|vignots","*Casque","*Porcelaine","*Chiton","*Palourde","*Limace de mer|lievre de mer",
 "**Achatine|escargot geant,achatine"],
 ["La pêche du lambi est réglementée aux Antilles pour protéger ce gros coquillage menacé par la surpêche."]);
T('AN',"Insectes des Antilles",["Moustique","Ravet|cafard","Mouche","Papillon","Fourmi","Abeille|mouche a miel","Guêpe|guepe","Coccinelle|bete a bon dieu","Luciole|bete a feu,bet a fe,mouche a feu","Sauterelle|sotrel","Libellule",
 "*Fourmi manioc|manioc","*Termite|poux de bois","*Dynaste hercule|scieur de long,hercule","*Yenyen|yen yen","*Mante religieuse|mante","*Monarque|papillon monarque","*Criquet",
 "**Charançon du bananier|charancon"],
 ["Le dynaste hercule, appelé scieur de long, est l'un des plus grands coléoptères du monde : le mâle peut dépasser 15 cm."]);

/* --- Géographie et langue --- */
T('AN',"Îles des Caraïbes",["Martinique","Guadeloupe","Dominique","Sainte-Lucie|sainte lucie","Barbade","Grenade","Trinidad|trinite","Tobago","Antigua","Montserrat","Cuba","Jamaïque|jamaique","Haïti|haiti","Porto Rico","Saint-Martin","Saint-Barthélemy|saint barth","Marie-Galante|marie galante","Les Saintes|saintes","Curaçao|curacao","Aruba",
 "*Saint-Vincent|saint vincent","*Barbuda","*Saint-Kitts|saint christophe","*Nevis","*Anguilla","*Saba","*Saint-Eustache|statia","*Bonaire","*La Désirade|desirade","*Bahamas","*Îles Vierges|iles vierges","*Bequia","*Carriacou","*Moustique|mustique",
 "**Tortola","**Saint-Thomas","**Sainte-Croix|sainte croix","**Îles Caïmans|caimans","**Turks-et-Caïcos|turks","**Margarita","**Union"],
 ["La Dominique, entre la Martinique et la Guadeloupe, est surnommée l'île nature pour ses forêts et ses rivières."]);
T('AN',"Expressions créoles",["Sa ou fè ?|sa ou fe","Ka ou fè ?|ka ou fe","Kouman ou yé ?|koman ou ye,kouman ou ye","Mwen la|mwen la wi","Pa ni pwoblèm|pa ni pwoblem","Mèsi anpil|mesi anpil","Bonjou tout moun|bonjou toutmoun",
 "*Tjenbé rèd pa moli|tjenbe red pa moli","*An nou alé|an nou ale","*Sé sa menm|se sa menm","*Pé bouch ou|pe bouch ou","*Lévé kò'w|leve kow","*Ou konprann ?|ou konprann","*Bon apéti|bon apeti",
 "**Pa ni pwen|pa ni pwen","**Sé pa jé|se pa je"],
 ["Aux Antilles, on répond souvent « Mwen la » (je suis là) à « Sa ou fè ? » (comment ça va ?)."]);
T('AN',"Mots créoles de la cuisine",["Manjé|manje","Diri|riz","Pwa|pwa","Dlo","Sèl|sel","Piman","Lanmori","Sitwon|siton","Zaboka","Bannann","Pen","Lèt|let","Zé|ze","Vyann|vyan","Pwason","Kafé|kafe",
 "*Kannari","*Koui|kwi","*Zépis|zepi","*Zonyon","*Lay","*Siwo","*Sik","*Kabrit","*Fig|fig","*Kolonbo",
 "**Lanbi","**Kalalou"],
 ["En créole, « fig » désigne la banane dessert, et « bannann » la banane plantain."]);
T('AN',"Mots créoles de la nature",["Lanmè|lanme","Larivyè|larivye","Lapli","Solèy|soley","Lalin","Zétwal|zetwal","Van","Mòn|mon","Bwa","Pyé-bwa|pye bwa","Fèy|fey","Flè|fle","Zwazo","Krab",
 "*Ravin","*Sab","*Wòch|woch","*Tè|te","*Syèl|syel","*Loraj","*Siklòn|siklon","*Zéklè|zekle",
 "**Lanmen dlo|lanmen dlo","**Bèt a fé|bet a fe"],
 ["« Pyé-bwa » veut dire arbre : littéralement, le « pied de bois »."]);
T('AN',"Mots créoles du carnaval",["Vaval","Vidé|vide","Mas","Déboulé|deboule","Tanbou","Kostim|kostim","Mardi gra|mardi gras","Mèkrèdi lasann|mekredi lasann",
 "*Bradjak|bradjak","*Lendi gra|lendi gras","*Dimanch gra|dimanch gras","*Diab","*Bwa bwa|bwabwa","*Chouval bwa|chouval bwa",
 "**Lapofig","**Mas a lapo|mas a lapo"],
 ["Le « bradjak », vieille voiture décorée, défile au carnaval de Martinique."]);
T('MQ',"Produits locaux de Martinique",["Rhum","Banane","Ananas","Canne à sucre|canne","Melon","Igname","Christophine","Piment","Madras","Chocolat|cacao","Sirop de batterie|batterie","Farine de manioc|manioc",
 "*Miel","*Café|cafe","*Vanille","*Confiture","*Poterie","*Bakoua","*Punch",
 "**Doucelette","**Vesou"],
 ["Le sirop de batterie est un sirop épais obtenu en cuisant longuement le jus de canne."]);

/* ---------- Corrections et ajouts d'après les sources officielles (28/09/2026) ----------
   INSEE (communes), DEAL Martinique (rivières), Comité martiniquais du tourisme (plages, pitons, musées),
   DAC Martinique / ministère de la Culture (monuments historiques), Ville de Fort-de-France (quartiers),
   DAAF Martinique (distilleries AOC), UICN France (espèces endémiques). Détail dans le fichier de relecture. */
function fixAns(title,from,to){const t=THEMES.find(x=>x.t===title);const i=t?t.a.indexOf(from):-1;if(i>=0)t.a[i]=to;}
function addAns(title,list){const t=THEMES.find(x=>x.t===title);if(t)t.a.push(...list);}

fixAns("Les communes de Martinique","*Le Gros-Morne","*Gros-Morne|le gros morne");
fixAns("Les communes de Martinique","**Ajoupa-Bouillon","**L'Ajoupa-Bouillon|ajoupa bouillon");

addAns("Rivières de Martinique",["*Rivière Roche|roche","**Rivière Desroses|desroses","**Rivière Claire|claire","**Rivière de Fond Bourlet|fond bourlet","**Rivière de l'Anse Céron|anse ceron"]);

fixAns("Plages de Martinique","Les Salines|grande anse des salines","Les Salines|grande anse des salines,anse des salines,petite anse des salines,grande terre des salines");

fixAns("Monuments et bâtiments historiques de Martinique","*Moulin de Val d'Or|val d or","*Habitation Val d'Or|val d or,moulin de val d or");
fixAns("Monuments et bâtiments historiques de Martinique","*Théâtre municipal de Fort-de-France|theatre municipal","*Théâtre Aimé Césaire|theatre municipal,theatre municipal de fort de france,ancien hotel de ville,hotel de ville de fort de france");
fixAns("Monuments et bâtiments historiques de Martinique","**Cathédrale du Mouillage|mouillage","**Cathédrale du Mouillage|mouillage,cathedrale notre dame de l assomption,notre dame de l assomption");
fixAns("Monuments et bâtiments historiques de Martinique","Château Dubuc|dubuc","Château Dubuc|dubuc,habitation la caravelle");
fixAns("Monuments et bâtiments historiques de Martinique","*Habitation Saint-Étienne|saint etienne","*Habitation Saint-Étienne|saint etienne,distillerie saint etienne");
addAns("Monuments et bâtiments historiques de Martinique",["*Habitation Leyritz|leyritz","*Habitation Pécoul|pecoul","*Fontaine Gueydon|gueydon","*Église du Fort|eglise du fort","*Maison Aimé Césaire|maison cesaire","*Statue de l'impératrice Joséphine|statue de josephine,imperatrice josephine","*Marché couvert de Saint-Pierre|marche de saint pierre","*Hôtel de préfecture|prefecture",
 "**Habitation Beauséjour|beausejour","**Fort d'Alet|alet","**Tombeau de la Dame Espagnole|dame espagnole","**Observatoire du Morne des Cadets|morne des cadets","**Château Aubéry|aubery","**Phare de la Pointe des Nègres|phare pointe des negres","**Maison coloniale de santé|maison coloniale","**Habitation Perrinelle|perrinelle","**Habitation Saint-Jacques|saint jacques","**Bassin de radoub|radoub","**Hôpital militaire de Fort-de-France|hopital militaire","**Lycée Schœlcher|lycee schoelcher","**Villa Monplaisir|monplaisir"]);

addAns("Musées et lieux culturels de Martinique",["*Muséum d'histoire naturelle|museum","*Musée historique de Saint-Pierre|musee de saint pierre","*Maison du volcan|volcan","**Galerie d'histoire et de la mer|galerie de la mer","**Musée des figurines végétales|figurines vegetales","**Musée de la pêche|peche","**Maison du Bagnard|bagnard","**Musée du château Dubuc|chateau dubuc"]);

fixAns("Quartiers de Fort-de-France","*Bord de Canal|bo kannal,canal alaric","*Bord de Canal|bo kannal,canal alaric,bord canal");
fixAns("Quartiers de Fort-de-France","*Citron","*Citron|trenelle citron");
fixAns("Quartiers de Fort-de-France","Bellevue","Bellevue|langellier bellevue");
addAns("Quartiers de Fort-de-France",["*Renéville|reneville","*Pointe de la Vierge|pointe vierge","*Morne Calebasse|calebasse","*Hauts du Port|les hauts du port","*Fond d'Or|fond d or","*Montgérald|montgerald","*Bon Air",
 "**Crozanville","**La Meynard|meynard","**Voix de Ville|voix de ville","**Langellier","**Pont de Chaînes|pont de chaine","**Ravine Bouillé|ravine bouille","**Bas Maternité|bas maternite","**La Folie","**Baie des Tourelles|tourelles","**Fonds Sinistrés|fond sinistre","**Toquade","**Morne Morissot|morissot"]);

addAns("Marques de rhum de Martinique",["**Héritiers Madkaud|madkaud"]);

fixAns("Espèces endémiques des Antilles","Matoutou falaise|matoutou","Matoutou falaise|matoutou,mygale de martinique,caribena versicolor,avicularia versicolor");
fixAns("Espèces endémiques des Antilles","*Couresse de la Martinique|couresse","*Couresse de la Martinique|couresse,couleuvre de martinique,liophis cursor");
fixAns("Espèces endémiques des Antilles","*Hylode de la Martinique|hylode","*Hylode de la Martinique|hylode,rainette de martinique,eleutherodactylus martinicensis");
fixAns("Espèces endémiques des Antilles","Oriole de Martinique|carouge","Oriole de Martinique|carouge,oriole,icterus bonana");
addAns("Espèces endémiques des Antilles",["**Dynaste de Martinique|dynaste,scieur de long"]);

fixAns("Mornes, pitons et montagnes de Martinique","*Piton Lacroix|lacroix","*Piton Lacroix|lacroix,morne pavillon");
addAns("Mornes, pitons et montagnes de Martinique",["*Morne Piquet|piquet"]);

/* ---------- Vérification Guadeloupe, Guyane, Saint-Martin, Saint-Barthélemy (28/09/2026) ---------- */
fixAns("Les communes de Guyane","Rémire-Montjoly|remire,montjoly","Remire-Montjoly|remire,montjoly,remire montjoly");
fixAns("Les communes de Guyane","*Papaïchton|papaichton","*Papaichton|papaichton");

fixAns("Sites et monuments de Guadeloupe","*Habitation Murat|murat","*Habitation Murat|murat,moulin murat");
fixAns("Sites et monuments de Guadeloupe","**Cathédrale de Basse-Terre|notre dame de guadeloupe","**Cathédrale de Basse-Terre|notre dame de guadeloupe,cathedrale notre dame de guadeloupe");
addAns("Sites et monuments de Guadeloupe",["*Réserve Cousteau|cousteau,ilets pigeon","*Parc national de la Guadeloupe|parc national","*Fort Louis|fort l union","*Tour du Père-Labat|pere labat","*Habitation La Grivelière|griveliere","*Maison natale de Saint-John Perse|maison saint john perse",
 "**Gueule Grand Gouffre|grand gouffre","**Moulin Bézard|bezard","**Usine Darboussier|darboussier","**Cinéma Renaissance|renaissance","**Habitation La Joséphine|la josephine","**Redoute d'Arbaud|arbaud","**Parc des roches gravées|roches gravees"]);

addAns("Plages de Guadeloupe",["*Anse à la Gourde|gourde","*Plage du Souffleur|souffleur","*La Perle|plage de la perle","*Pain de Sucre|pain de sucre","*Salako","*Anse Champagne|champagne","**Folle Anse","**Anse des Rochers|anse rochers"]);

addAns("Rivières de Guadeloupe",["*Rivière du Plessis|plessis","*Rivière du Pérou|perou","*Rivière du Petit Carbet|petit carbet","**Rivière Grande Plaine|grande plaine","**Canal des Rotours|rotours","**Rivière du Lamentin|riviere lamentin"]);

addAns("Sites et monuments de Guyane",["*Cathédrale Saint-Sauveur|saint sauveur","*Place des Amandiers|amandiers","*Maison natale de Félix Éboué|felix eboue","*Jardin botanique de Cayenne|jardin botanique","*Salines de Montjoly|salines","*Zoo de Guyane|zoo",
 "**Îlet la Mère|ilet la mere","**Fort Diamant|diamant","**Habitation Loyola|loyola","**Fort Trio|trio","**Léproserie de l'Acarouany|acarouany"]);

addAns("Plages de Saint-Martin",["*Great Bay|grande baie","*Little Bay","*Tintamarre","*Oyster Bay|oyster pond","*Galisbay|galis bay","**Petite Plage","**Cole Bay","**Baie de l'Embouchure|coconut grove,embouchure","**Baie Blanche"]);

addAns("Plages de Saint-Barthélemy",["*Public|plage de public","**Petite Anse|anse de la petite anse"]);

/* ---------- Variantes d'orthographe supplémentaires (créole, abréviations, formes courantes) ---------- */
function addAlias(title,name,list){const t=THEMES.find(x=>x.t===title);if(!t)return;const i=t.a.findIndex(s=>s.replace(/^\*+/,'').split('|')[0]===name);if(i<0)return;const [h,al]=t.a[i].split('|');t.a[i]=h+'|'+[...(al?al.split(','):[]),...list].join(',');}
addAlias("Animaux de Martinique","Mangouste",["mangous","manglous"]);
addAlias("Animaux de Martinique","Manicou",["manikou","maniku"]);
addAlias("Animaux de Martinique","Iguane",["iwann","igwann","zigwann"]);
addAlias("Animaux de Martinique","Chauve-souris",["chòv-souri","chov souri","sourit"]);
addAlias("Animaux de Martinique","Crabe de terre",["krab","krab tè","krab te"]);
addAlias("Animaux de Martinique","Poisson volant",["pwason volan","volan"]);
addAlias("Fruits qu'on trouve aux Antilles","Mangue",["mang","mango"]);
addAlias("Fruits qu'on trouve aux Antilles","Banane",["fig","fig mi","banann"]);
addAlias("Fruits qu'on trouve aux Antilles","Goyave",["gwayav","goyav"]);
addAlias("Fruits qu'on trouve aux Antilles","Papaye",["papay"]);
addAlias("Fruits qu'on trouve aux Antilles","Corossol",["kowosol","korosol"]);
addAlias("Fruits qu'on trouve aux Antilles","Ananas",["zannanna","zanana","annanas"]);
addAlias("Fruits qu'on trouve aux Antilles","Orange",["zoranj","oranj"]);
addAlias("Fruits qu'on trouve aux Antilles","Citron vert",["sitwon","sitron"]);
addAlias("Fruits qu'on trouve aux Antilles","Sapotille",["sapoti","sapotiy"]);
addAlias("Fruits qu'on trouve aux Antilles","Pomme-cannelle",["pom kannel","pomcannelle"]);
addAlias("Fruits qu'on trouve aux Antilles","Tamarin",["tanmaren","tamaren"]);
addAlias("Plats créoles","Accras",["akra lanmori","acras de morue","accra"]);
addAlias("Plats créoles","Boudin créole",["boudin kreyol","bouden"]);
addAlias("Plats créoles","Court-bouillon",["kout bouyon","court bouillon de poisson"]);
addAlias("Plats créoles","Riz aux pois rouges",["diri ek pwa","diri pwa","riz et pois"]);
addAlias("Plats créoles","Ragoût de cochon",["ragou kochon","ragou"]);
addAlias("Plats créoles","Pâté en pot",["pate an po","pateanpot"]);
addAlias("Plats créoles","Colombo",["kolonbo","colombo de poulet","colombo de cabri"]);
addAlias("Plats créoles","Fricassée de lambi",["fwikase lanbi","lanbi"]);
addAlias("Plats créoles","Dombrés",["donbre","dombré"]);
addAlias("Épices et aromates de la cuisine créole","Piment",["piman","piment antillais"]);
addAlias("Épices et aromates de la cuisine créole","Bois d'Inde",["bwadenn","bois dinde","bwa dinde"]);
addAlias("Épices et aromates de la cuisine créole","Cive",["siv","cives"]);
addAlias("Épices et aromates de la cuisine créole","Thym",["ten","tin"]);
addAlias("Épices et aromates de la cuisine créole","Persil",["pèsi","pesi"]);
addAlias("Épices et aromates de la cuisine créole","Ail",["lay"]);
addAlias("Épices et aromates de la cuisine créole","Oignon pays",["zonyon","zonyon péyi","oignon"]);
addAlias("Épices et aromates de la cuisine créole","Gingembre",["jenjanm","jinjanm"]);
addAlias("Épices et aromates de la cuisine créole","Cannelle",["kannel","kanel"]);
addAlias("Épices et aromates de la cuisine créole","Clou de girofle",["klou jiwof","jiwof"]);
addAlias("Épices et aromates de la cuisine créole","Muscade",["miskad"]);
addAlias("Légumes et tubercules des Antilles","Igname",["yanm","ziyanm","yam"]);
addAlias("Légumes et tubercules des Antilles","Patate douce",["patat","patat dous"]);
addAlias("Légumes et tubercules des Antilles","Christophine",["kristofin","chouchou","chayotte"]);
addAlias("Légumes et tubercules des Antilles","Giraumon",["jiwomon","jiromon","potiron"]);
addAlias("Légumes et tubercules des Antilles","Fruit à pain",["friyapen","fwiyapen","châtaigne pays"]);
addAlias("Légumes et tubercules des Antilles","Banane plantain",["bannann","plantain"]);
addAlias("Légumes et tubercules des Antilles","Pois rouges",["pwa wouj","pwa"]);
addAlias("Légumes et tubercules des Antilles","Gombo",["kalalou","gonbo"]);
addAlias("Personnages des contes et légendes créoles","Compère Lapin",["konpè lapen","kompè lapin","konpe lapin","lapen"]);
addAlias("Personnages des contes et légendes créoles","Manman Dlo",["manmandlo","maman de l'eau","mère de l'eau"]);
addAlias("Personnages des contes et légendes créoles","Zombi",["zonbi","zombie"]);
addAlias("Personnages des contes et légendes créoles","Soukougnan",["soukouyan","soukougnian","soukouniyan"]);
addAlias("Personnages des contes et légendes créoles","Diablesse",["djablès","guiablesse","diablès","la djables"]);
addAlias("Personnages des contes et légendes créoles","Cheval à trois pattes",["chouval twa pat","chval twa pat","cheval 3 pattes"]);
addAlias("Fêtes, danses et traditions","Carnaval",["kannaval","kanaval"]);
addAlias("Fêtes, danses et traditions","Bèlè",["bele","bel air","belè"]);
addAlias("Fêtes, danses et traditions","Chanté Nwèl",["chante nwel","chanté noël","chanter noel"]);
addAlias("Fêtes, danses et traditions","Tour des yoles",["tour des yoles rondes","yol","yol won"]);
addAlias("Instruments de musique traditionnels","Tanbou bèlè",["tambou","tanbou","tambour"]);
addAlias("Instruments de musique traditionnels","Conque de lambi",["kòn lanbi","kon lambi","lambi"]);
addAlias("Boissons et cocktails antillais","Ti-punch",["ti ponch","ti pons","tipunch","ti'punch","ti-ponch"]);
addAlias("Boissons et cocktails antillais","Planteur",["plantè","planter"]);
addAlias("Boissons et cocktails antillais","Jus de canne",["ji kann","jus canne","vesou"]);
addAlias("Boissons et cocktails antillais","Chodo",["chaudeau","chodot"]);
addAlias("Boissons et cocktails antillais","Shrubb",["schrub","chrub","shrub"]);
addAlias("Les communes de Martinique","Fort-de-France",["fodfrans","fòdfrans","fort de france","fdf","foyal"]);
addAlias("Les communes de Martinique","Le Lamentin",["lamanten","lamanten","lamentin"]);
addAlias("Les communes de Martinique","Le François",["franswa","fransoi"]);
addAlias("Les communes de Martinique","Le Robert",["wobè","robè","robert"]);
addAlias("Les communes de Martinique","Sainte-Marie",["senmari","sainte marie"]);
addAlias("Les communes de Martinique","La Trinité",["latrinite","trinité"]);
addAlias("Les communes de Martinique","Saint-Pierre",["senpiè","st pierre","saint pierre"]);
addAlias("Les communes de Martinique","Le Vauclin",["voklen","vauclin"]);
addAlias("Les communes de Martinique","Les Trois-Îlets",["twazilet","trois ilets","3 ilets"]);
addAlias("Les communes de Martinique","Le Diamant",["dyaman","diaman"]);
addAlias("Les communes de Martinique","Le Marin",["maren","marin"]);
addAlias("Les communes de Martinique","Sainte-Anne",["sentann","st anne"]);
addAlias("Les communes de Martinique","Sainte-Luce",["sentlis","st luce"]);
addAlias("Les communes de Martinique","Saint-Joseph",["senjozef","st joseph"]);
addAlias("Les communes de Martinique","Ducos",["diko","dukos"]);
addAlias("Les communes de Guadeloupe","Pointe-à-Pitre",["pwentapit","lapwent","pap","pointe a pitre"]);
addAlias("Les communes de Guadeloupe","Basse-Terre",["bastè","baste","basse terre"]);
addAlias("Les communes de Guadeloupe","Les Abymes",["zabim","abymes"]);
addAlias("Les communes de Guadeloupe","Le Moule",["moul","le moul"]);
addAlias("Mots créoles de la cuisine","Manjé",["manger","manje"]);
addAlias("Mots créoles de la cuisine","Diri",["riz"]);
addAlias("Mots créoles de la cuisine","Lanmori",["morue","lamori"]);
addAlias("Mots créoles de la nature","Lanmè",["la mer","lanme","lanmé"]);
addAlias("Mots créoles de la nature","Solèy",["soleil","soley","soléy"]);
addAlias("Mots créoles de la nature","Lapli",["la pluie","lapli"]);

/* ---- Relecture lot 1 (29/09/2026, croisée avec Wikipédia, CMT, INAO, Parc national de la Guadeloupe) ---- */
(function(){
 const IL="Îles des Caraïbes",MC="Mots créoles du quotidien (en créole)",SI="Sites incontournables de Martinique",AR="Artistes de musique antillaise",FR="Fruits qu'on trouve aux Antilles",AN="Animaux de Martinique";
 addAlias(IL,"Porto Rico",["puerto rico","borinquen","boriken"]);
 addAlias(IL,"Îles Vierges",["iles vierges britanniques","iles vierges americaines","virgin islands"]);
 addAlias(IL,"Saint-Eustache",["sint eustatius"]);
 addAlias(IL,"Union",["union island","ile union"]);
 addAns(IL,["*Hispaniola|republique dominicaine,saint domingue","**Petite Martinique","**Canouan","**Mayreau","**Tobago Cays","**Culebra"]);
 fixAns(MC,"*Fwè|fwe","*Frè|fre,fwè,fwe");
 fixAns(MC,"Chyen|chien","Chyen|chen");
 addAlias(MC,"Tjenbé rèd",["tchimbe red","tchenbe red"]);
 addAlias(MC,"Pyé-bwa",["pyebwa"]);
 addAns(MC,["Moun","*Rivé|rive","*Soti","*Kouri","*Anpil","*Fè|fe"]);
 fixAns(SI,"**Fond Saint-Jacques","**Fonds Saint-Jacques|fond saint jacques,habitation fonds saint jacques,domaine de fonds saint jacques");
 fixAns(SI,"*Musée Paul Gauguin|gauguin","*Centre Paul Gauguin|gauguin,musee paul gauguin,musee gauguin,centre d interpretation paul gauguin");
 addAlias(SI,"Gorges de la Falaise",["gorges de la riviere falaise","cascade de la riviere falaise"]);
 addAns(SI,["**Cascade Didier|didier","*Anse Couleuvre|couleuvre"]);
 addAns(AR,["**Pierre-Édouard Décimus|decimus,pierre edouard decimus","**Jean-Claude Naimro|naimro","*Christiane Obydol|obydol,chris obydol"]);
 addAlias(FR,"Pois doux",["pwa dous","inga"]);
 addAlias(FR,"Cerise pays",["cerise de barbade"]);
 addAns(FR,["Pastèque|melon d eau,melon dlo","*Litchi|letchi","**Mangoustan","**Grenade","**Cacao|cabosse,kako"]);
 addAlias(AN,"Pipiri",["pipirit"]);
 addAlias(AN,"Mabouya",["mabouia"]);
})();

/* ---- Relecture lot 2 (29/09/2026) ---- */
(function(){
 const del=(title,name)=>{const t=THEMES.find(x=>x.t===title);if(t)t.a=t.a.filter(s=>s.replace(/^\*+/,'').split('|')[0]!==name);};
 const HI="Grandes figures de l'histoire martiniquaise",RE="Reptiles des Antilles et de Guyane",OI="Oiseaux des Antilles",OM="Oiseaux marins des Antilles",PO="Poissons pélagiques des Antilles",PL="Plats créoles",EP="Épices et aromates de la cuisine créole";
 del(HI,"Wendie Renard");del(HI,"Ronald Pognon"); // sportifs : déjà dans « Sportifs nés aux Antilles et en Guyane »
 addAlias(HI,"Joséphine de Beauharnais",["tascher de la pagerie","josephine de la pagerie"]);
 addAns(HI,["*René Maran|maran","**Georges Gratiant","**Hippolyte Morestin|morestin","**Jules Monnerot|monnerot"]);
 addAlias(RE,"Tortue charbonnière",["molokoi","tortue charbonniere a pattes rouges"]);
 addAlias(RE,"Mabouya",["gecko","margouillat","scinque mabouya"]);
 addAns(RE,["**Tortue denticulée|tortue denticulee,denticulee"]);
 addAlias(OI,"Pipiri",["pipirit","pipirite","tyran gris"]);
 addAlias(OI,"Perdrix",["colin de virginie"]);
 addAlias(OI,"Colibri madère",["colibri falle rouge","fal wouj","kolibri fal wouj"]);
 addAlias(OM,"Paille-en-queue",["phaethon","paille en queue"]);
 del(PO,"Listao");addAlias(PO,"Bonite",["listao","thon listao","bonite a ventre raye"]);
 addAlias(PL,"Souskaï",["souskay"]);
 fixAns(EP,"*Chadron béni|chadron beni,coriandre","*Chadron béni|chadron beni,chadon beni,chardon beni,chadon,fitoula,coulante");
 addAlias(EP,"Bonda Man Jacques",["bondamanjak","bonda man jak"]);
})();

/* ---- Mode Ti moun : thèmes simples pour les enfants (réponses en français ou en créole) ---- */
(function(){
 const K=(t,a,anec,opt)=>{THEMES.push({terr:'AN',t,a,kid:true,...(opt||{})});ANEC[THEMES.length-1]=anec||[];};
 K("Les couleurs (en français ou en créole)",["Rouge|wouj","Bleu|blé","Vert|vèt,vet","Jaune|jòn,jon","Noir|nwè,nwe","Blanc|blan","Rose|woz","Orange|zoranj","Violet|vyolèt,vyolet","Marron|mawon","Gris|gri","*Doré|dore","*Argenté|argente","*Turquoise","*Beige"],
  ["En créole, on dit « wouj » pour rouge et « jòn » pour jaune."]);
 K("Compter de 1 à 10 en créole",["Yonn|yon,youn","Dé|de","Twa","Kat","Senk|sink","Sis","Sèt|set","Uit|wit","Nèf|nef","Dis"],
  ["En créole, on compte : yonn, dé, twa, kat, senk, sis, sèt, uit, nèf, dis."],{keep:['de']});
 K("Le corps en créole",["Tèt|tet","Zyé|zye,zie","Nen","Bouch","Zòrèy|zorey,zorèy","Lanmen|lamen","Pyé|pye","Dan","Chivé|cheve,chive","Vant","Do","Jounou","*Zong","*Kou","*Zépòl|zepol","*Dwèt|dwet","*Lang","*Kò|ko"],
  ["« Lanmen » veut dire la main, et « pyé » le pied."]);
 K("Les animaux de chez nous",["Chat","Chien|chyen","Poule|poul","Coq|kok","Cochon|kochon","Bœuf|bef,bèf,boeuf","Cabri|kabrit,chèvre,chevre","Mouton","Lapin|lapen","Âne|bourik,ane","Cheval|chouval","Canard|kanna","Anolis|zandoli","Crabe|krab","Poisson|pwason","Colibri|kolibri,foufou","Manicou|manikou","Mangouste|mangous","Iguane|igwann","Tortue|toti,tòti","Grenouille|krapo,crapaud","*Mabouya","*Agouti|zagouti","*Cafard|ravet","*Papillon|papiyon","*Fourmi|fonmi,fwonmi","*Moustique|moustik"],
  ["Le colibri est le plus petit oiseau des Antilles : il peut voler sur place et même en arrière !"]);
 K("À la plage",["Sable|sab","Mer|lanmè,lanme","Vague|lanm","Soleil|solèy,soley","Coquillage|koki","Crabe|krab","Poisson|pwason","Cocotier|pyé koko,pye koko","Serviette","Maillot de bain|maillot","Parasol","Seau","Pelle","Château de sable|chateau de sable","Bouée|bouee","Masque","*Tuba","*Palmes","*Oursin|chadron","*Bateau|kannot,canot","*Crème solaire|creme solaire","*Raisinier|rézinyé,rezinye","*Tortue marine|tortue"],
  ["Attention au mancenillier au bord des plages : ses fruits ressemblent à des petites pommes, mais ils sont très toxiques."]);
 K("Personnages des contes et légendes",["Compère Lapin|konpè lapen,lapen,lapin","Compère Zamba|konpè zanba,zamba,zanba","Compère Tig|tig,konpe tig","Manman Dlo|maman dlo,mama dlo","Ti-Jean|ti jan,tijan,ti jean","Soukougnan|soukouyan","Diablesse|djablès,djables","Zombi|zonbi","*Chouval twa pat|cheval trois pattes,chouval 3 pat","*Bête à Man Ibè|manibe,bet a man ibe","*Konpè Kabrit|compere cabri,kabrit","*Dorlis","*Volant|volan","*Papa Diab|diab,diable"],
  ["Dans les contes, Compère Lapin est petit mais très malin : il gagne souvent contre Compère Zamba, qui est grand et fort."]);
 K("Au carnaval",["Vaval","Touloulou","Diable rouge|djab wouj,diab wouj","Masque|mas","Déguisement|deguisement","Char","Tambour|tanbou","Confettis","Vidé|vide","Mardi gras|madi gra","Mercredi des Cendres|mercredi des cendres","Diablesse|djablès","*Bwa bwa|bwabwa","*Nèg gwo siwo|neg gwo siwo","*Caroline zié kokli|karolin,caroline","*Mariyan lapofig|lapofig","*Mariage burlesque"],
  ["Vaval, le roi du carnaval, est brûlé le mercredi des Cendres, et tout le monde lui dit au revoir en noir et blanc."]);
 K("Jeux de la cour de récré",["Cache-cache|cache cache","Marelle","Corde à sauter|corde","Loup|chat","Billes|mab,bille","Toupie|toupi","Cerf-volant|sèvolan,sevolan,kap","Ballon|foot,football","Chat perché|chat perche","Un deux trois soleil|1 2 3 soleil,123 soleil","Élastique|elastique","*Osselets|osselet","*Dominos|domino","*Colin-maillard|colin maillard","*Chaise musicale|chaises musicales","*Ronde"],
  ["Autrefois, les enfants des Antilles fabriquaient leurs cerfs-volants avec des baguettes de bambou et du papier de soie."]);
 K("Les métiers",["Pêcheur|pechè,pecheur","Boulanger|boulangère","Docteur|médecin,medecin","Maître|maîtresse,professeur,prof","Pompier","Policier|gendarme","Agriculteur|planteur,cultivateur","Coiffeur|coiffeuse","Chauffeur|chauffeur de bus","Marchande|machann,marchand","Infirmier|infirmière","Cuisinier|cuisinière","Facteur","Maçon|macon","*Charpentier","*Vétérinaire|veterinaire","*Conteur|kontè,konte","*Musicien","*Pilote","*Dentiste"],
  ["Au marché, on dit « machann » pour la marchande."]);
})();
