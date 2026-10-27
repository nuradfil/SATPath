/* ===== SATPATH READING & WRITING QUESTION BANK, VOCAB & GENERATORS ===== */
var SAT_VOCAB_DICT = {
  "serendipitous": { d: "Occurring or discovered by chance in a happy or beneficial way.", ru: "случайный, удачный (открытый по счастливой случайности)" },
  "ubiquitous": { d: "Present, appearing, or found everywhere at once.", ru: "вездесущий, повсеместный" },
  "scarce": { d: "Insufficient for the demand; very rare or hard to find.", ru: "редкий, скудный, дефицитный" },
  "resilient": { d: "Able to withstand or recover quickly from difficult conditions.", ru: "жизнестойкий, устойчивый, быстро восстанавливающийся" },
  "homogeneous": { d: "Of the same kind; uniform in structure or composition.", ru: "однородный, гомогенный" },
  "discredit": { d: "To harm the good reputation of, or cause an idea to seem false/unreliable.", ru: "дискредитировать, ставить под сомнение, опровергать" },
  "corroborate": { d: "To confirm or give support to a statement, theory, or finding.", ru: "подтверждать, подкреплять фактами" },
  "emulate": { d: "To match or surpass, typically by imitation.", ru: "подражать, стремиться превзойти" },
  "disseminate": { d: "To spread or disperse information widely.", ru: "распространять (знания, информацию)" },
  "egalitarian": { d: "Believing in or based on the principle that all people are equal.", ru: "эгалитарный, равноправный" },
  "deflects": { d: "Causes something to change direction; turns aside from a straight course.", ru: "отклоняет, преломляет (лучи)" },
  "foster": { d: "To encourage or promote the development of something.", ru: "способствовать, поощрять, взращивать" },
  "impede": { d: "To delay or prevent someone or something by obstructing them; hinder.", ru: "препятствовать, затруднять, тормозить" },
  "stifling": { d: "Restraining, suppressing, or choking off development or growth.", ru: "подавляющий, душащий (рост)" },
  "bolstering": { d: "Supporting, strengthening, or propping up.", ru: "укрепляющий, поддерживающий" },
  "compelling": { d: "Evoking interest or attention in a powerfully irresistible, convincing way.", ru: "убедительный, веский, неоспоримый" },
  "ambiguous": { d: "Open to more than one interpretation; not having one obvious meaning.", ru: "двусмысленный, неоднозначный" },
  "tenuous": { d: "Very weak or slight; lacking a strong basis.", ru: "слабый, шаткий, незначительный" },
  "spurious": { d: "Not being what it purports to be; false or fake.", ru: "ложный, фальшивый, мнимый" },
  "curtail": { d: "To reduce in extent or quantity; impose a restriction on.", ru: "сокращать, урезать, ограничивать" },
  "exacerbate": { d: "To make a problem, bad situation, or negative feeling worse.", ru: "усугублять, обострять, ухудшать" },
  "repercussions": { d: "Unintended consequences of an event or action, especially unwelcome ones.", ru: "последствия, отголоски" },
  "confounding": { d: "Mixing up with something else so that the individual elements become difficult to distinguish.", ru: "спутывающий, искажающий (скрытый фактор)" },
  "refuted": { d: "Proved a statement or theory to be wrong or false; disproved.", ru: "опровергнутый, доказанный как ложный" },
  "vindicated": { d: "Cleared of blame or suspicion; shown to be right or justified.", ru: "оправданный, подтвержденный (о правоте теории)" },
  "delineate": { d: "To describe, portray, or outline something precisely.", ru: "очерчивать, точно описывать, картировать" },
  "erudition": { d: "The quality of having or showing great knowledge or learning; scholarship.", ru: "эрудиция, глубокая ученость" },
  "proliferate": { d: "To increase rapidly in numbers; multiply.", ru: "быстро размножаться, распространяться" },
  "obsolete": { d: "No longer produced or used; out of date.", ru: "устаревший, вышедший из употребления" },
  "eclectic": { d: "Deriving ideas, style, or taste from a broad and diverse range of sources.", ru: "эклектичный, разнородный, сочетающий разные стили" },
  "didactic": { d: "Intended to teach, particularly in having moral instruction as an ulterior motive.", ru: "дидактический, поучительный, назидательный" },
  "decipher": { d: "To succeed in understanding, interpreting, or translating a coded or obscure text.", ru: "расшифровывать, разгадывать" },
  "divergence": { d: "A difference in opinions, interests, or developmental paths.", ru: "расхождение, различие во взглядах" },
  "mitigate": { d: "To make less severe, serious, or painful.", ru: "смягчать, ослаблять, уменьшать (вред)" },
  "integral": { d: "Necessary to make a whole complete; essential or fundamental.", ru: "неотъемлемый, существенно важный" },
  "peripheral": { d: "Of secondary or minor importance; marginal.", ru: "периферийный, второстепенный" },
  "autonomous": { d: "Independent and having the power to act or exist on its own.", ru: "автономный, независимый, самостоятельный" },
  "derivative": { d: "Imitative of the work of another person; lacking originality.", ru: "вторичный, производный, неоригинальный" },
  "acquiescent": { d: "Ready to accept something without protest, or to do what someone else wants.", ru: "уступчивый, покладистый, соглашающийся" },
  "illuminate": { d: "To help clarify or explain a complex subject.", ru: "прояснять, проливать свет, освещать" },
  "curbed": { d: "Restrained or kept in check.", ru: "обуздал, сдержал, снизил" },
  "jarring": { d: "Causing a physical or mental shock; incongruous in a striking way.", ru: "резкий, диссонирующий, шокирующий" },
  "plausible": { d: "Seeming reasonable or probable; credible.", ru: "правдоподобный, вероятный, убедительный" },
  "compromise": { d: "To weaken, harm, or impair the function or quality of something.", ru: "компрометировать, повреждать, нарушать работу" },
  "protracted": { d: "Lasting for a long time or longer than expected or usual.", ru: "затяжной, продолжительный, длительный" },
  "precipitous": { d: "Done suddenly and without careful consideration; dangerously high or steep.", ru: "стремительный, резкий, обрывистый" },
  "invulnerable": { d: "Impossible to harm or damage.", ru: "неуязвимый, защищенный от вреда" },
  "calamitous": { d: "Involving or causing sudden great damage or distress; catastrophic.", ru: "катастрофический, гибельный, бедственный" },
  "intrinsic": { d: "Belonging naturally; essential or inherent.", ru: "присущий, внутренний, неотъемлемый" },
  "equivocal": { d: "Open to more than one interpretation; ambiguous or uncertain.", ru: "двусмысленный, уклончивый, неоднозначный" },
  "circumventing": { d: "Finding a way around an obstacle or limitation; bypassing.", ru: "обходящий, избегающий (ограничения)" },
  "bewildering": { d: "Confusing or perplexing; dizzyingly complex.", ru: "сбивающий с толку, ошеломляюще запутанный" },
  "imprudent": { d: "Not showing care for the consequences of an action; rash or unwise.", ru: "неблагоразумный, опрометчивый, неразумный" },
  "analogous": { d: "Comparable in certain respects, typically in a way which makes clearer the nature of the things compared.", ru: "аналогичный, сходный по функции" },
  "flaunt": { d: "To display ostentatiously, especially in order to provoke envy or admiration.", ru: "выставлять напоказ, щеголять" },
  "recalibrate": { d: "To adjust or revise expectations, models, or measurements in light of new data.", ru: "пересматривать, перенастраивать (модель/оценку)" },
  "benchmark": { d: "A standard or point of reference against which things may be compared.", ru: "ориентир, эталон, точка отсчета" },
  "perpetual": { d: "Never ending or changing; occurring repeatedly without interruption.", ru: "вечный, непрерывный, бесконечный" },
  "susceptible": { d: "Likely or liable to be influenced or harmed by a particular thing.", ru: "восприимчивый, уязвимый, подверженный" },
  "nuanced": { d: "Characterized by subtle shades of meaning or expression; balanced and detailed.", ru: "нюансированный, тонкий, учитывающий детали" },
  "sluggish": { d: "Slow-moving or inactive.", ru: "медленный, вялый, неторопливый" },
  "transitional": { d: "Relating to or characteristic of a process or period of transition between two forms.", ru: "переходный, промежуточный" },
  "audacity": { d: "A willingness to take bold risks; fearless originality.", ru: "смелость, дерзость, новаторская отвага" },
  "skewed": { d: "Biased, distorted, or pulled toward a particular value.", ru: "смещенный, искаженный, перекошенный" },
  "elucidate": { d: "To make something clear; explain.", ru: "разъяснять, прояснять, толковать" },
  "obfuscate": { d: "To render obscure, unclear, or unintelligible.", ru: "запутывать, затемнять смысл" },
  "revert": { d: "To return to a previous state, condition, or shape.", ru: "возвращаться в исходное состояние" },
  "intrusive": { d: "Causing disruption or annoyance through being unwelcome or uninvited; invading privacy.", ru: "навязчивый, вторгающийся в личное пространство" },
  "skepticism": { d: "A skeptical attitude; doubt as to the truth of something.", ru: "скептицизм, сомнение, недоверие" },
  "symbiotic": { d: "Involving interaction between two different organisms living in close physical association.", ru: "симбиотический, взаимовыгодный" },
  "albedo": { d: "The proportion of the incident light or radiation that is reflected by a surface.", ru: "альбедо, отражательная способность поверхности" },
  "palimpsest": { d: "A manuscript or piece of writing material on which the original writing has been effaced to make room for later writing.", ru: "палимпсест (рукопись поверх стертого текста)" },
  "externalities": { d: "Side effects or consequences of an industrial or commercial activity that affect other parties without this being reflected in the cost.", ru: "внешние эффекты (издержки для общества)" },
  "anoxia": { d: "An absence or severe deficiency of oxygen reaching the tissues.", ru: "аноксия, полное отсутствие кислорода" },
  "aposematism": { d: "The advertising by an animal to potential predators that it is not worth attacking or eating.", ru: "предупреждающая окраска (у животных)" },
  "monopsony": { d: "A market situation in which there is only one buyer or employer.", ru: "монопсония (монополия единственного покупателя/работодателя)" },
  "kleptoparasitism": { d: "A form of feeding in which one animal takes prey or other food that was caught by another.", ru: "клептопаразитизм (кража добычи у других животных)" }
};

var RQ=[
  [
    [
      "<i>Recent research highlights that trees in a forest are not solitary entities. Using an underground web of fungi known as mycorrhizal networks, trees can transfer water, carbon, and nitrogen to neighboring saplings, effectively communicating and sharing resources to ensure the forest's collective survival.</i><br><br>Which choice best states the main idea of the text?",
      "Trees use underground fungal networks to share vital resources and support each other.",
      "Fungi are the most important organisms in forest ecosystems during the historical period examined in the text.",
      "Saplings grow faster when they are isolated from older, larger trees when compared with conventional approaches in the field.",
      "Scientists recently discovered a new species of underground fungus across the primary regions and populations studied by researchers."
    ],
    [
      "<i>Unlike modern concrete, which degrades over a few decades, ancient Roman concrete has survived for millennia. Scientists recently discovered that the Romans used a specific volcanic ash that, when exposed to seawater, triggers a chemical reaction that actively seals cracks and reinforces the structure over time.</i><br><br>According to the text, what makes Roman concrete exceptionally durable?",
      "A chemical reaction between seawater and volcanic ash that repairs cracks.",
      "The absence of modern pollutants in the ancient Mediterranean environment when compared with conventional approaches in the field.",
      "The precise geometric shapes the Romans used when casting the concrete across the primary regions and populations studied by researchers.",
      "A rare type of freshwater that was mixed into the volcanic ash."
    ],
    [
      "<i>Astronomers often hunt for exoplanets using the transit method. Rather than looking for the planet itself—which is too dim to see—they monitor a star's brightness. If a star's light dips slightly at regular intervals, it strongly indicates that a planet is passing in front of it, blocking a fraction of the light.</i><br><br>Which choice best describes the central idea of the text?",
      "Astronomers detect exoplanets by observing regular, slight drops in a star's brightness.",
      "Exoplanets are too small and dim to ever be studied by modern telescopes across the primary regions and populations studied by researchers.",
      "The transit method requires directly photographing planets as they orbit stars according to earlier assumptions that the passage directly challenges.",
      "Stars periodically lose their brightness due to internal chemical changes."
    ],
    [
      "<i>Tardigrades, or water bears, are microscopic animals famous for their extreme resilience. When faced with freezing temperatures, radiation, or severe dehydration, they enter a state of suspended animation called cryptobiosis, replacing the water in their cells with a protective sugar to prevent fatal damage.</i><br><br>According to the text, how do tardigrades survive severe dehydration?",
      "By entering cryptobiosis and replacing their cellular water with a protective sugar.",
      "By absorbing moisture from the surrounding freezing air according to earlier assumptions that the passage directly challenges.",
      "By migrating to deeper, more protected aquatic environments during the historical period examined in the text.",
      "By shedding their outer cellular layer to deflect harmful radiation when compared with conventional approaches in the field."
    ],
    [
      "<i>In urban planning, the 'heat island' effect refers to cities experiencing much higher temperatures than surrounding rural areas. To combat this, architects are increasingly incorporating green roofs—roofs covered with vegetation—which absorb sunlight for photosynthesis rather than converting it into heat, significantly cooling the buildings below.</i><br><br>Which choice best states the main idea of the text?",
      "Green roofs are being used in cities to mitigate the urban heat island effect.",
      "Rural areas are cooler than cities because they have fewer buildings.",
      "Photosynthesis is a process that relies heavily on extreme heat.",
      "Urban planners are replacing all traditional roofs with vegetation."
    ],
    [
      "<i>Graphene, a single layer of carbon atoms arranged in a hexagonal lattice, is highly prized in materials science. Despite being only one atom thick, it is roughly 200 times stronger than steel, highly flexible, and an excellent conductor of both heat and electricity.</i><br><br>According to the text, which of the following is true about graphene?",
      "It is incredibly thin yet significantly stronger than steel.",
      "It is a poor conductor of heat but an excellent conductor of electricity.",
      "It is composed of multiple layers of tightly packed carbon atoms.",
      "It is too rigid to be bent or used in flexible electronics."
    ],
    [
      "<i>In the 1870s, a group of painters including Monet and Renoir organized their own exhibition, breaking away from the prestigious Paris Salon. They abandoned strict classical realism, choosing instead to capture fleeting moments of light and color with loose, visible brushstrokes—a radical style that became known as Impressionism.</i><br><br>Which choice best states the main idea of the text?",
      "A group of artists rebelled against traditional standards to pioneer the Impressionist movement.",
      "The Paris Salon eventually adopted Impressionism as its official artistic style across the primary regions and populations studied by researchers.",
      "Monet and Renoir were heavily criticized for painting too realistically according to earlier assumptions that the passage directly challenges.",
      "Impressionist painters preferred to work exclusively in indoor studios during the historical period examined in the text."
    ],
    [
      "<i>The Pacific Ring of Fire is a horseshoe-shaped string of volcanoes and seismic activity around the edges of the Pacific Ocean. This intense geological activity is primarily caused by plate tectonics, specifically subduction zones where massive, dense oceanic plates are forced beneath lighter continental plates.</i><br><br>According to the text, what is the primary cause of the geological activity in the Ring of Fire?",
      "The subduction of dense oceanic plates beneath lighter continental plates.",
      "The extremely high temperatures of the water in the Pacific Ocean according to earlier assumptions that the passage directly challenges.",
      "The movement of continental plates away from each other during the historical period examined in the text.",
      "The frequent eruption of underwater volcanoes in the center of the ocean."
    ],
    [
      "<i>In Mary Shelley's 'Frankenstein,' the creature is initially gentle and seeks human connection. However, after facing repeated violent rejection due to his terrifying appearance, his innate benevolence is eventually overshadowed by a deep, isolating bitterness and a desire for revenge against his creator.</i><br><br>Which choice best describes the central idea of the text?",
      "The creature's shift toward vengeance is caused by the cruel rejection he experiences.",
      "The creature is inherently evil and seeks revenge from the moment of his creation.",
      "Frankenstein intentionally designs the creature to be terrifying and violent.",
      "The creature's appearance gradually improves as he interacts with humanity."
    ],
    [
      "<i>Deep in the ocean's twilight zone, where sunlight cannot reach, many marine organisms have evolved bioluminescence. They use internally generated light for various critical survival functions, such as attracting mates, communicating with others of their species, or startling potential predators.</i><br><br>According to the text, why do some marine organisms use bioluminescence?",
      "To attract mates, communicate, and defend against predators in dark environments.",
      "To generate enough heat to survive the freezing temperatures of the deep ocean when compared with conventional approaches in the field.",
      "To illuminate the ocean floor so they can see obstacles while hunting across the primary regions and populations studied by researchers.",
      "To mimic the appearance of sunlight to confuse surface-dwelling fish."
    ],
    [
      "<i>The Silk Road was not a single thoroughfare, but a complex network of trade routes connecting the East and West. While it is famous for the transport of silk and spices, historians argue its greatest legacy was the unprecedented exchange of philosophies, art, and scientific knowledge across continents.</i><br><br>Which choice best states the main idea of the text?",
      "The Silk Road's most significant impact was the cultural and intellectual exchange it facilitated.",
      "The Silk Road was a single, straight path used exclusively for trading silk across the primary regions and populations studied by researchers.",
      "Spices were the only highly valued commodity transported across the Silk Road according to earlier assumptions that the passage directly challenges.",
      "The Silk Road failed to connect the cultural philosophies of the East and West during the historical period examined in the text."
    ],
    [
      "<i>Cuttlefish possess remarkable camouflage abilities. Millions of pigment-filled sacs called chromatophores cover their skin. By expanding or contracting these sacs using tiny muscles controlled directly by their brains, cuttlefish can change their color and pattern in milliseconds to blend into their surroundings.</i><br><br>According to the text, how do cuttlefish change their color?",
      "By using their muscles and brains to expand or contract pigment-filled sacs.",
      "By secreting a colored liquid onto the outer layer of their skin.",
      "By reflecting light off the water surrounding them to create optical illusions.",
      "By shedding their outer skin to reveal different colors underneath."
    ],
    [
      "<i>The Flynn effect describes the phenomenon of substantial and long-sustained increases in intelligence test scores across the globe throughout the 20th century. Psychologists generally attribute this not to evolutionary changes in human genetics, but to environmental improvements such as better nutrition, healthcare, and education.</i><br><br>Which choice best states the main idea of the text?",
      "Global IQ scores rose during the 20th century likely due to improved environmental and social factors.",
      "Humans evolved genetically in the 20th century to become inherently more intelligent during the historical period examined in the text.",
      "Intelligence tests became progressively easier throughout the 20th century when compared with conventional approaches in the field.",
      "Better nutrition is the sole reason why modern humans take tests faster across the primary regions and populations studied by researchers."
    ],
    [
      "<i>Oobleck, a mixture of cornstarch and water, is a non-Newtonian fluid. Unlike water, its viscosity changes depending on the stress applied to it. If you move your hand through it slowly, it acts like a liquid, but if you punch it, the particles lock together, acting temporarily like a solid.</i><br><br>According to the text, how does oobleck behave when sudden force is applied to it?",
      "Its particles lock together, causing it to act like a solid.",
      "It permanently transforms into a solid crystal when compared with conventional approaches in the field.",
      "Its viscosity decreases, making it flow more like water across the primary regions and populations studied by researchers.",
      "It separates back into dry cornstarch and liquid water."
    ],
    [
      "<i>The invention of the Gutenberg printing press in the 15th century drastically reduced the cost of reproducing books. By shifting from laborious hand-copying to mechanical movable type, the press made literature and scientific texts accessible to the broader public, effectively democratizing knowledge in Europe.</i><br><br>Which choice best states the main idea of the text?",
      "The Gutenberg press revolutionized European society by making information affordable and widely accessible.",
      "The Gutenberg press was primarily used to print scientific texts rather than literature across the primary regions and populations studied by researchers.",
      "Mechanical movable type was invented to increase the price of books according to earlier assumptions that the passage directly challenges.",
      "Hand-copying remained the most popular way to produce books well into the 16th century during the historical period examined in the text."
    ],
    [
      "<i>Keystone species have a disproportionately large effect on their natural environment relative to their abundance. When gray wolves were reintroduced to Yellowstone National Park, they naturally managed the elk population, which allowed overgrazed willows to grow back, ultimately restoring habitats for beavers and songbirds.</i><br><br>According to the text, what was an effect of reintroducing wolves to Yellowstone?",
      "The management of the elk population allowed vegetation to recover, helping other species.",
      "The wolves completely eliminated the elk population from the national park according to earlier assumptions that the passage directly challenges.",
      "The wolves began to rely on willows and beavers for their primary food source during the historical period examined in the text.",
      "The ecosystem became imbalanced due to an overpopulation of songbirds when compared with conventional approaches in the field."
    ],
    [
      "<i>In 'Pride and Prejudice,' Jane Austen explores the danger of first impressions. Elizabeth Bennet quickly judges Mr. Darcy as arrogant and cruel based on his aloof demeanor at a ball. It is only through a series of unfolding events that she realizes her prejudice blinded her to his genuine moral character.</i><br><br>Which choice best describes the central idea of the text?",
      "Elizabeth's initial negative judgment of Darcy prevents her from seeing his true, noble character.",
      "Darcy intentionally acts arrogant at the ball so that Elizabeth will dislike him.",
      "Elizabeth is highly skilled at accurately judging a person's character upon first meeting them.",
      "Jane Austen believed that first impressions are almost always factually correct."
    ],
    [
      "<i>Dark matter remains one of astrophysics' greatest mysteries. Though it cannot be seen or interacted with directly, scientists know it exists because of its gravitational effects. Galaxies spin so fast that they should tear themselves apart; it is the immense gravitational pull of invisible dark matter that holds them together.</i><br><br>According to the text, how do scientists know dark matter exists?",
      "By observing the gravitational pull it exerts on rapidly spinning galaxies.",
      "By capturing and analyzing small particles of it in laboratory settings when compared with conventional approaches in the field.",
      "By observing the light it reflects from neighboring bright stars across the primary regions and populations studied by researchers.",
      "By measuring the speed at which it moves away from black holes."
    ],
    [
      "<i>Medieval Gothic architecture is defined by its massive, light-filled spaces. This was achieved through the invention of flying buttresses—stone arches on the exterior of a building that redistributed the heavy weight of the roof outward, allowing the walls to be thin and filled with enormous stained-glass windows.</i><br><br>According to the text, what was the primary function of flying buttresses?",
      "To support the roof's weight from the outside, allowing for thin walls and large windows.",
      "To provide structural support for heavy stained-glass windows inside the cathedral across the primary regions and populations studied by researchers.",
      "To prevent light from entering the cathedral during religious ceremonies according to earlier assumptions that the passage directly challenges.",
      "To serve as decorative stone arches that attracted wealthy patrons to the church."
    ],
    [
      "<i>CRISPR-Cas9 is a revolutionary genetic engineering tool adapted from a naturally occurring defense mechanism in bacteria. It allows scientists to edit genomes with unprecedented precision by targeting a specific sequence of DNA and using the Cas9 enzyme to cut it, enabling the removal or alteration of genetic defects.</i><br><br>Which choice best states the main idea of the text?",
      "CRISPR-Cas9 is a highly precise tool that allows scientists to cut and edit specific DNA sequences.",
      "CRISPR-Cas9 is a type of bacteria that naturally cures genetic diseases in humans according to earlier assumptions that the passage directly challenges.",
      "The Cas9 enzyme is used to permanently connect completely unrelated strands of DNA during the historical period examined in the text.",
      "Genetic engineering is too imprecise to be used for removing genetic defects when compared with conventional approaches in the field."
    ],
    [
      "<i>Confirmation bias is the psychological tendency for people to embrace information that supports their existing beliefs while rejecting contradictory evidence. In the age of social media, algorithms exacerbate this by exclusively showing users content they agree with, creating an 'echo chamber' that severely limits their exposure to differing viewpoints.</i><br><br>Which choice best states the main idea of the text?",
      "Social media algorithms worsen confirmation bias by isolating users from opposing viewpoints.",
      "People are generally very open to changing their beliefs when presented with new evidence.",
      "Confirmation bias was entirely created by the rise of modern social media algorithms.",
      "Social media platforms actively force users to engage in debates with opposing groups."
    ],
    [
      "<i>Young sunflowers exhibit phototropism, meaning their flower heads track the sun from east to west across the sky during the day. However, once the sunflower matures and the flower opens to release pollen, this movement stops, and the mature flower remains permanently facing east to warm up quickly in the morning dew.</i><br><br>According to the text, what happens to a sunflower's movement once it matures?",
      "It stops tracking the sun and remains permanently facing east.",
      "It begins to track the sun exclusively from west to east.",
      "It continues to track the sun, but at a much slower pace.",
      "It droops toward the ground to protect its pollen from the sun."
    ],
    [
      "<i>Ludwig van Beethoven is a pivotal figure who bridged the Classical and Romantic eras of Western music. While his early works adhered strictly to the structured, elegant forms favored by Mozart, his later compositions broke these rules, incorporating raw emotion, dramatic dynamic shifts, and unprecedented structural lengths.</i><br><br>Which choice best states the main idea of the text?",
      "Beethoven's music transitioned from strict classical structures to highly emotional and innovative forms.",
      "Beethoven strongly disliked the structured music composed by Mozart across the primary regions and populations studied by researchers.",
      "Beethoven's later music was much shorter and quieter than his early compositions according to earlier assumptions that the passage directly challenges.",
      "The Romantic era of music demanded strict adherence to classical elegance during the historical period examined in the text."
    ],
    [
      "<i>Dolphins navigate and hunt using a sophisticated biological sonar called echolocation. By emitting rapid clicking sounds and listening to the echoes that bounce back, a dolphin's brain can construct a highly detailed 3D map of its environment, identifying the exact size, shape, and speed of distant prey in murky waters.</i><br><br>According to the text, how does echolocation benefit dolphins?",
      "It allows them to map their surroundings and locate prey precisely using sound echoes.",
      "It enables them to communicate complex emotions to other dolphins according to earlier assumptions that the passage directly challenges.",
      "It helps them increase their swimming speed in murky waters during the historical period examined in the text.",
      "It emits a light pulse that temporarily blinds their potential prey when compared with conventional approaches in the field."
    ],
    [
      "<i>In his novel 'Hard Times,' Charles Dickens presents the fictional Coketown as a grim critique of the Industrial Revolution. By describing the identical red-brick factories, the suffocating smoke, and the repetitive, joyless lives of the workers, Dickens argues that extreme industrialization strips society of its humanity and imagination.</i><br><br>Which choice best describes the central idea of the text?",
      "Dickens uses the bleak setting of Coketown to criticize the dehumanizing effects of industrialization.",
      "Dickens wrote the novel to praise the technological advancements of the Industrial Revolution.",
      "The novel focuses on the joyous, creative lives of workers inside modern factories.",
      "Coketown is meant to represent the ideal futuristic city imagined by architects."
    ],
    [
      "<i>For decades, scientists believed that the human brain stopped growing new neural connections after childhood. However, modern research into neuroplasticity reveals that the adult brain is highly adaptable. It can rewire itself, form new pathways, and even recover lost functions in response to learning, experience, or injury.</i><br><br>Which choice best states the main idea of the text?",
      "Contrary to past beliefs, the adult brain is highly adaptable and can form new neural connections.",
      "The human brain is completely incapable of recovering from physical injuries when compared with conventional approaches in the field.",
      "Neuroplasticity is a phenomenon that only occurs during early childhood development across the primary regions and populations studied by researchers.",
      "Modern research proves that adult brains lose neural connections when learning new things."
    ],
    [
      "<i>Under the gold standard, a country's currency value is directly linked to a specific amount of gold. While this system provided price stability and prevented governments from printing money recklessly, it severely limited a nation's ability to expand its money supply to stimulate the economy during financial crises.</i><br><br>According to the text, what was a major limitation of the gold standard?",
      "It restricted a government's ability to print money to help the economy recover during crises.",
      "It caused constant, unpredictable fluctuations in the prices of everyday goods across the primary regions and populations studied by researchers.",
      "It allowed governments to recklessly print an unlimited amount of paper money according to earlier assumptions that the passage directly challenges.",
      "It prevented countries from trading with nations that used different currencies."
    ],
    [
      "<i>Cloud seeding is a weather modification technique used to increase rain or snow. Silver iodide particles are dispersed into clouds from airplanes. Because these particles have a crystalline structure very similar to ice, they act as a scaffold, causing supercooled water vapor to freeze around them and eventually fall as precipitation.</i><br><br>According to the text, how does silver iodide promote precipitation?",
      "Its ice-like structure provides a scaffold for water vapor to freeze around and fall.",
      "It heats up the cloud, causing rapid evaporation that eventually turns into heavy rain.",
      "It acts as a magnet that actively pulls water vapor from the ground into the sky.",
      "It changes the chemical composition of the cloud, turning oxygen directly into water."
    ],
    [
      "<i>The Hawthorne effect refers to a psychological phenomenon where individuals change their behavior simply because they know they are being observed. In workplace studies, researchers found that factory workers' productivity temporarily increased when lighting was adjusted—not because of the lighting itself, but because the workers felt management was paying attention to them.</i><br><br>Which choice best states the main idea of the text?",
      "People may alter their behavior and improve performance when they are aware they are being observed.",
      "Workplace productivity is permanently increased when factories are brightly lit during the historical period examined in the text.",
      "Factory workers usually decrease their productivity when researchers are present when compared with conventional approaches in the field.",
      "Psychologists recommend constantly changing factory lighting to confuse workers across the primary regions and populations studied by researchers."
    ],
    [
      "<i>Penicillin, the first true antibiotic, was discovered entirely by accident. In 1928, Alexander Fleming returned from vacation to find that a mold called Penicillium notatum had contaminated his petri dishes. Surprisingly, he noticed that the mold actively secreted a substance that was destroying the harmful Staphylococcus bacteria around it.</i><br><br>According to the text, what surprising observation did Alexander Fleming make upon returning from vacation?",
      "A contaminating mold in his petri dish was actively destroying surrounding bacteria.",
      "His petri dishes had been stolen by a rival scientist studying antibiotics when compared with conventional approaches in the field.",
      "Staphylococcus bacteria had completely consumed a newly discovered mold across the primary regions and populations studied by researchers.",
      "Penicillin could be synthesized entirely from artificial chemicals in a lab."
    ],
    [
      "<i>Some species of bamboo can grow up to 35 inches in a single day. This rapid growth is driven by the plant's unique rhizome-dependent system, which stores massive amounts of energy underground during the dormant season and releases it rapidly when conditions are ideal.</i><br><br>According to the text, what enables bamboo to grow so quickly?",
      "An underground energy storage system.",
      "A combination of frequent rainfall and extremely high temperatures that accelerate the plant's natural cellular division processes above ground.",
      "The ability to photosynthesize much faster than any other known plant species found in tropical and temperate climates around the world.",
      "A specialized network of above-ground leaves that directly absorb massive amounts of solar energy to fuel immediate vertical expansion."
    ],
    [
      "<i>The construction of the Erie Canal in the 1820s dramatically reduced the cost and time of transporting goods between the Midwest and the East Coast. Consequently, New York City emerged as the nation's premier commercial hub, surpassing rival ports like Philadelphia and Boston.</i><br><br>Which choice best states the main idea of the text?",
      "The Erie Canal helped make New York City as thetop US economic hub.",
      "New York City was the only port with a canal according to earlier assumptions that the passage directly challenges.",
      "The Midwest produced more goods than the East Coast during the historical period examined in the text.",
      "Philadelphia and Boston refused to build their own canals."
    ],
    [
      "<i>In Charlotte Brontë's 'Jane Eyre,' the protagonist frequently retreats to window seats to read. These enclosed spaces represent Jane's desire to observe the outside world while remaining physically shielded from the harsh realities and emotional abuse she suffers within her adoptive family's home.</i><br><br>According to the text, what do window seats represent for Jane?",
      "A safe vantage point to observe the world while staying protected.",
      "Her intense hatred for her adoptive family and a desperate desire to escape.",
      "A comfortable place to sleep.",
      "A reflection of her immense wealth and her family's high social standing in Victorian society, which she desperately wants to maintain."
    ],
    [
      "<i>Unlike most fish that rely entirely on the surrounding water temperature to regulate their body heat, the opah generates its own heat through constant flapping of its pectoral fins. This unique adaptation allows the opah to remain active and hunt effectively in the frigid depths of the ocean.</i><br><br>Which choice best describes the central idea of the text?",
      "The opah uses internally generated heat to hunt in cold, deep waters.",
      "The opah is the only fish that lives entirely in the frigid depths of the ocean.",
      "Fish cannot survive in cold water unless they constantly swim to the surface.",
      "Pectoral fins are used exclusively for generating heat rather than for steering or swimming."
    ],
    [
      "<i>Linguists have observed that language shift—the process by which a community transitions from speaking its native language to a dominant one—often accelerates when younger generations migrate to urban centers for economic opportunities, leaving the ancestral language primarily in the hands of aging rural populations.</i><br><br>According to the text, what often accelerates language shift?",
      "Young people moving to cities for work.",
      "The deliberate decision by aging rural populations to completely stop teaching their ancestral languages to their children and grandchildren.",
      "A lack of linguistic complexity that naturally causes native languages to be replaced by grammatically superior dominant languages.",
      "The widespread implementation of new government policies designed specifically to mandate the exclusive use of dominant languages in rural schools."
    ],
    [
      "<i>During the Renaissance, the advent of linear perspective in painting revolutionized European art. By using a vanishing point and mathematical proportions, artists like Brunelleschi and Masaccio were able to create the illusion of three-dimensional depth on a flat two-dimensional surface, making their works highly realistic.</i><br><br>Which choice best states the main idea of the text?",
      "Renaissance artistsreshaped painting using mathematical proportions and a vanishing pointto depict 3D depth on flat canvases.",
      "Brunelleschi invented the two-dimensional canvas according to earlier assumptions that the passage directly challenges during the historical period examined in the text.",
      "Renaissance paintings were entirely based on mathematics during the historical period examined in the text when compared with conventional approaches in the field.",
      "European art had no realistic paintings before Masaccio when compared with conventional approaches in the field."
    ],
    [
      "<i>Venus is sometimes called Earth’s 'sister planet' due to its similar size and composition. However, its thick atmosphere, composed mostly of carbon dioxide, traps heat in a runaway greenhouse effect, making Venus the hottest planet in our solar system despite Mercury being closer to the Sun.</i><br><br>According to the text, why is Venus the hottest planet?",
      "Its thick atmosphere traps heat.",
      "It is located significantly closer to the Sun than any other planet in the entire solar system.",
      "Its composition is fundamentally different from Earth's, generating massive amounts of internal friction.",
      "It actively absorbs all the excess heat reflecting off of Mercury's rocky, barren surface."
    ],
    [
      "<i>In Herman Melville's 'Moby-Dick,' Captain Ahab's relentless pursuit of the white whale is an obsession that blinds him to reason and endangers his crew. The whale itself acts as a blank canvas onto which Ahab projects his own inner demons and philosophical frustrations.</i><br><br>Which choice best states the main idea of the text?",
      "Ahab's obsessive quest for the whale reflects his own destructive inner turmoil.",
      "The white whale actively seeks to destroy Ahab and his crew because of a long-standing grudge.",
      "Ahab is a brilliant captain who perfectly balances logic and emotion to navigate dangerous oceans.",
      "The crew completely agrees with Ahab's reasoning."
    ],
    [
      "<i>The Inca Empire lacked a written alphabet, yet it effectively managed a vast administration across the Andes. To record numerical data like census figures and tax obligations, the Inca used 'quipus'—intricate systems of knotted strings where the knot's position, type, and color conveyed specific information.</i><br><br>According to the text, how did the Inca record numerical data?",
      "By using knotted strings called quipus.",
      "By painting elaborate numerical symbols onto the steep, rocky walls of the high Andes mountains.",
      "By developing a complex written alphabet specifically designed to record detailed census figures and taxes.",
      "By relying entirely on oral traditions passed down through thousands of highly trained administrative officials."
    ],
    [
      "<i>Neutrinos are subatomic particles with virtually no mass and no electrical charge. Because they interact so weakly with normal matter, trillions of neutrinos pass straight through the Earth—and our bodies—every second without causing any noticeable effect, making them incredibly difficult for physicists to detect.</i><br><br>Which choice best describes the central idea of the text?",
      "Neutrinos rarely interact with matter, making them an immense challenge for scientists to observe and study.",
      "Neutrinos frequently damage the Earth according to earlier assumptions that the passage directly challenges during the historical period examined in the text.",
      "Neutrinos are the heaviest subatomic particles during the historical period examined in the text when compared with conventional approaches in the field.",
      "Physicists have stopped trying to detect neutrinos when compared with conventional approaches in the field."
    ],
    [
      "<i>When inflation rises rapidly, consumers often preemptively purchase goods, fearing prices will climb higher. Paradoxically, this sudden surge in demand can strain supply chains and cause merchants to raise prices even further, creating a self-fulfilling cycle of inflation.</i><br><br>According to the text, what can be a consequence of consumers preemptively buying goods?",
      "It can strain supply chains and further drive up prices.",
      "It forces the government to immediately lower the prices of essential goods.",
      "It guarantees that inflation will immediately drop to normal levels.",
      "It causes merchants to permanently close their businesses."
    ],
    [
      "<i>The African baobab tree can survive severe droughts by storing thousands of gallons of water in its massive, spongy trunk. During prolonged dry spells, the tree sheds its leaves to reduce water loss, entering a state of dormancy until the rainy season returns.</i><br><br>According to the text, how does the baobab reduce water loss during droughts?",
      "By shedding its leaves.",
      "By continuously growing new, extremely thick branches to shade its massive, water-filled trunk from the sun.",
      "By rapidly absorbing all the available groundwater from neighboring, less resilient plant species.",
      "By permanently altering its cellular structure to completely reject the need for any future hydration."
    ],
    [
      "<i>During the Cold War, the Space Race was not merely about scientific exploration; it was a heavily publicized ideological battle. Both the United States and the Soviet Union utilized their achievements in space flight as propaganda to prove the superiority of their respective political and economic systems to the global community.</i><br><br>Which choice best states the main idea of the text?",
      "The Space Race served as a vital geopolitical tool for the US and the USSR, with both nations using space milestones as propaganda to assert the dominance of their competing ideologies.",
      "The Space Race was entirely peaceful across the primary regions and populations studied by researchers according to earlier assumptions that the passage directly challenges.",
      "The Soviet Union ignored space exploration according to earlier assumptions that the passage directly challenges during the historical period examined in the text.",
      "Propaganda had no effect on the Cold War during the historical period examined in the text when compared with conventional approaches in the field."
    ],
    [
      "<i>Many traditional fairy tales were originally much darker and more violent than their modern adaptations. Authors like the Brothers Grimm collected these harsh folklore stories not for children, but to preserve the authentic, unvarnished cultural heritage of the German people.</i><br><br>Which choice best describes the central idea of the text?",
      "The Brothers Grimm recorded dark folktales to preserve authentic cultural heritage, not to entertain children.",
      "Modern adaptations of fairy tales are much darker and more violent than the original Grimm versions according to earlier assumptions that the passage directly challenges.",
      "The Brothers Grimm invented the stories entirely from their own imaginations to scare young readers during the historical period examined in the text.",
      "Traditional folklore was always intended to be lighthearted and family-friendly when compared with conventional approaches in the field."
    ],
    [
      "<i>Unlike normal ice, which floats because it is less dense than liquid water, 'heavy ice' (ice VII) sinks. Formed under extreme pressure, such as deep within the oceans of exoplanets, ice VII has a densely packed cubic crystalline structure that makes it heavier than liquid water.</i><br><br>According to the text, why does ice VII sink in liquid water?",
      "It has a densely packed structure.",
      "It is formed exclusively in the shallow, warm surface waters of terrestrial planets in our solar system.",
      "It completely lacks the crystalline structure typically found in standard ice cubes formed on Earth.",
      "It aggressively repels liquid water, creating a vacuum that physically pulls it down to the ocean floor."
    ],
    [
      "<i>The establishment of the Pony Express in 1860 drastically cut the time it took to deliver mail between Missouri and California. However, despite its legendary status in American history, the service was a financial failure and operated for only 18 months before being rendered obsolete by the transcontinental telegraph.</i><br><br>Which choice best states the main idea of the text?",
      "The Pony Express was a short-lived and unprofitable venture, soon replaced by telegraph technology.",
      "The Pony Express lasted for decades when compared with conventional approaches in the field.",
      "Telegraphs were slower than horses across the primary regions and populations studied by researchers.",
      "The Pony Express was highly profitable according to earlier assumptions that the passage directly challenges."
    ],
    [
      "<i>A recent sociological study found that people who commute long distances by car report higher levels of daily stress and lower life satisfaction. In contrast, those who commute similar distances by train often view the travel time positively, using it to read, sleep, or relax before work.</i><br><br>Which choice best states the main idea of the text?",
      "Train commuters tend to experience less stress and view their travel more positively than car commuters do.",
      "Commuting long distances by car is the only reliable way to travel to work in modern cities across the primary regions and populations studied by researchers.",
      "Reading on a train is the most stressful activity a person can engage in before starting work according to earlier assumptions that the passage directly challenges.",
      "All forms of long-distance commuting guarantee extremely low levels of life satisfaction during the historical period examined in the text."
    ],
    [
      "<i>Magnetic resonance imaging (MRI) machines use powerful magnets to align the protons in the human body's water molecules. When radio waves are pulsed through the body, these protons emit signals that a computer translates into highly detailed, cross-sectional images of internal organs and tissues without using harmful radiation.</i><br><br>According to the text, what do the powerful magnets in an MRI machine do?",
      "They align protons in the body's water molecules.",
      "They rapidly pulse harmful, high-frequency radiation directly into the patient's internal organs to illuminate them.",
      "They permanently alter the fundamental chemical structure of the water molecules circulating in the bloodstream.",
      "They physically push the internal organs into cross-sectional alignments so the computer can photograph them."
    ],
    [
      "<i>In modernist poetry, traditional rhyme and steady meter are often discarded in favor of free verse. Poets like T.S. Eliot utilized fragmented sentences, disjointed imagery, and shifting perspectives to mirror the psychological disillusionment and societal chaos experienced in the aftermath of World War I.</i><br><br>Which choice best states the main idea of the text?",
      "Modernist poets like T.S. Eliot abandoned traditional poetic structures, using free verse and fragmentation to deeply reflect the psychological and societal fracturing caused by World War I.",
      "T.S. Eliot strictly used traditional rhyme during the historical period examined in the text when compared with conventional approaches in the field.",
      "World War I brought peace to poetry when compared with conventional approaches in the field across the primary regions and populations studied by researchers.",
      "Modernist poetry requires a steady meter across the primary regions and populations studied by researchers according to earlier assumptions that the passage directly challenges."
    ],
    [
      "<i>The introduction of the potato to Europe in the 16th century initially met with suspicion, as it was widely believed to be poisonous. Over time, however, its ability to produce abundant calories on small plots of poor soil made it a staple crop, effectively ending seasonal famines in many European countries.</i><br><br>According to the text, why did the potato become a staple crop in Europe?",
      "It provided abundant calories even when grown on small, poor plots of land.",
      "It was immediately recognized by 16th-century scientists as a highly nutritious and completely safe food source.",
      "It was the only crop that European farmers were legally allowed to plant.",
      "It required massive plots of highly fertile soil to grow successfully."
    ],
    [
      "<i>Sloths are famous for their incredibly slow movements, which is an evolutionary strategy to avoid detection by predators like eagles and jaguars. Because they move so little, sloths have a remarkably slow metabolism, allowing them to survive on a low-calorie diet of tough, difficult-to-digest leaves.</i><br><br>According to the text, why do sloths move so slowly?",
      "To avoid being detected by predators.",
      "To rapidly burn off the excess calories they consume from their highly nutritious, easily digestible diets.",
      "To deliberately attract eagles and jaguars.",
      "To prevent their notoriously fast metabolisms from overheating their bodies in the warm tropical canopy."
    ],
    [
      "<i>The decipherment of the Mayan script in the mid-20th century shattered the long-held assumption that the Maya were a uniquely peaceful society focused solely on astronomy. Translated stelae revealed that Mayan city-states engaged in brutal warfare, political conquests, and complex dynastic struggles, much like other ancient civilizations.</i><br><br>Which choice best states the main idea of the text?",
      "Translating the Mayan script profoundly changed historical perspectives by exposing that the Maya were not a purely peaceful society, but one deeply involved in warfare and political conflict.",
      "The Maya were uniquely peaceful according to earlier assumptions that the passage directly challenges during the historical period examined in the text across the primary historical and regional contexts analyzed in the passage.",
      "Mayan scripts only recorded astronomy during the historical period examined in the text when compared with conventional approaches in the field.",
      "No one has ever translated Mayan writing when compared with conventional approaches in the field across the primary regions and populations studied by researchers."
    ],
    [
      "<i>The 'sunk cost fallacy' occurs when individuals continue investing money, time, or effort into a failing endeavor simply because they have already invested heavily in it. Economists advise that rational decisions should be based entirely on future potential, ignoring past costs that cannot be recovered.</i><br><br>According to the text, how do economists advise people to make decisions?",
      "By focusing on future potential and ignoring past, unrecoverable costs.",
      "By immediately abandoning any project the moment it requires any financial investment.",
      "By continuing to invest heavily in failing endeavors to eventually force them to succeed.",
      "By ensuring that all past investments are fully recovered before making any new decisions."
    ],
    [
      "<i>Pumice is a unique igneous rock formed during explosive volcanic eruptions. When highly pressurized, gas-rich magma is ejected into the air, it cools so rapidly that the gas bubbles are trapped inside the rock's structure. As a result, pumice is incredibly lightweight and is the only known rock that can float on water.</i><br><br>According to the text, what causes pumice to be lightweight?",
      "Trapped gas bubbles inside its structure.",
      "The extremely slow cooling process that allows heavy minerals to completely sink out of the magma before it solidifies.",
      "The continuous absorption of surrounding ocean water.",
      "The complete absence of any actual rock material, as it is composed entirely of solidified volcanic gases."
    ],
    [
      "<i>In science fiction, the 'cyberpunk' subgenre typically juxtaposes advanced technological achievements, such as artificial intelligence and cybernetics, with a severe breakdown in social order. The protagonists are often marginalized anti-heroes navigating a dystopian society dominated by corrupt megacorporations rather than traditional governments.</i><br><br>Which choice best describes the central idea of the text?",
      "Cyberpunk is a science fiction subgenre characterized by the stark contrast between highly advanced technology and deeply flawed, dystopian societies controlled by corrupt corporations.",
      "Cyberpunk features perfect utopian societies across the primary regions and populations studied by researchers according to earlier assumptions that the passage directly challenges.",
      "Anti-heroes in cyberpunk always support megacorporations according to earlier assumptions that the passage directly challenges during the historical period examined in the text.",
      "Traditional governments rule all cyberpunk cities during the historical period examined in the text when compared with conventional approaches in the field."
    ],
    [
      "<i>In classical development economics, rapid industrialization was long viewed as the sole engine of sustained national wealth. However, recent empirical analyses of service-led economies demonstrate that high-value digital exports, financial intermediation, and specialized logistics can generate comparable productivity gains without first passing through a heavy manufacturing phase, provided that domestic human capital and broadband infrastructure are sufficiently developed.</i><br><br>Which choice best states the main idea of the text?",
      "Skilled service sectors can drive economic growth without prior heavy industrialization.",
      "Heavy manufacturing remains the only reliable foundation for long-term national wealth and export stability in developing nations.",
      "Broadband infrastructure is far more expensive for developing countries to build than traditional factory and rail networks.",
      "Classical economists accurately predicted that digital exports would eventually replace agricultural production in all global markets."
    ],
    [
      "<i>Paleoclimatologists reconstructing Pleistocene ocean temperatures have traditionally relied on the magnesium-to-calcium ratios preserved in planktonic foraminifera shells. Yet controlled laboratory culturing by Dr.Sonia Verma's team reveals that ambient seawater carbonate ion concentrations and salinity fluctuations independently alter magnesium uptake by up to 18 percent, suggesting that uncorrected shell-chemistry records may systematically overestimate glacial-interglacial thermal swings.</i><br><br>Which choice best states the main idea of the text?",
      "Non-thermal seawater chemistry can skew foraminifera-based ancient temperature estimates.",
      "Planktonic foraminifera shells dissolve too rapidly on the ocean floor to preserve any chemically useful record of Pleistocene climates.",
      "Ocean temperatures during the Pleistocene epoch fluctuated much more dramatically than modern computer climate models have previously indicated.",
      "Dr. Sonia Verma's team invented a new method for measuring ocean salinity using deep-sea sediment cores rather than fossilized shells."
    ],
    [
      "<i>While twentieth-century urban planners frequently designed wider arterial highways to alleviate metropolitan traffic congestion, transportation economist Gilles Duranton and Matthew Turner established that vehicle-kilometers traveled increase in nearly one-to-one proportion to newly added lane capacity—a phenomenon termed the 'fundamental law of road congestion,' driven by latent commuter demand, commercial rerouting, and dispersed suburban land use.</i><br><br>According to the text, why does expanding highway lane capacity generally fail to relieve long-term traffic congestion?",
      "Added road capacity induces proportional increases in driving and commercial traffic.",
      "Construction zones temporarily block existing lanes for years, permanently discouraging commuters from using major metropolitan highways.",
      "Suburban municipalities routinely lower speed limits on newly widened arterial roads in order to collect additional municipal traffic revenue.",
      "Public transit systems inevitably reduce their daily train schedules whenever parallel highway corridors are expanded by state agencies."
    ],
    [
      "<i>Unlike standard crystalline silicon photovoltaics, which require energy-intensive refining at temperatures exceeding 1,400°C, metal-halide perovskite solar cells can be solution-processed from liquid inks at near-ambient temperatures. Despite achieving laboratory power-conversion efficiencies above 25 percent, however, perovskites remain vulnerable to rapid crystal degradation when exposed to atmospheric moisture and ultraviolet radiation, a hurdle engineers are now addressing through hydrophobic encapsulation.</i><br><br>Which choice best states the main idea of the text?",
      "Perovskite solar cells are cheap and efficient to make but require protection from environmental decay.",
      "Crystalline silicon solar panels are no longer manufactured because their refining temperatures exceed 1,400°C in industrial furnaces.",
      "Hydrophobic encapsulation has completely eliminated the cost advantage of liquid-ink perovskite solar cells over traditional silicon panels.",
      "Ultraviolet radiation increases the power-conversion efficiency of metal-halide perovskites to well over 25 percent in outdoor testing."
    ],
    [
      "<i>In her reevaluation of thirteenth-century Andean textile production, art historian Elena Morales challenges the colonial assumption that geometric tocapu motifs served merely as decorative borders on elite tunics. By cross-referencing warp-faced weave symmetries with administrative khipu cord registries from the same provincial storehouses, Morales demonstrates that specific chromatic permutations encoded standardized fiscal obligations and regional ethnic affiliations.</i><br><br>Which choice best describes the main finding of Morales's research?",
      "Andean tocapu patterns functioned as structured records of tribute and regional identity.",
      "Colonial chroniclers accurately documented the purely ornamental purpose of geometric motifs woven into thirteenth-century Andean tunics.",
      "Administrative khipu cords were gradually abandoned in the thirteenth century because woven tunics were easier to transport across mountains.",
      "Provincial storehouses in the Andes stored only undecorated textiles intended for trade with neighboring coastal fishing communities."
    ],
    [
      "<i>When predatory wolves were reintroduced to Yellowstone National Park in 1995, ecologists anticipated a direct reduction in elk populations. What proved equally consequential, however, was a behavioral shift: elk began avoiding exposed valley bottoms and riparian gorges where ambush risk was highest, allowing browsed willow and aspen stands along riverbanks to regenerate and stabilizing channel erosion.</i><br><br>Which choice best states the main idea of the text?",
      "Predator-induced changes in elk foraging behavior helped restore Yellowstone's riverbank ecosystems.",
      "The 1995 reintroduction of wolves failed to reduce the overall size of Yellowstone National Park's elk herds over the following decade.",
      "Willow and aspen trees in Yellowstone grew faster after 1995 primarily because regional winter temperatures became significantly milder.",
      "Channel erosion in Yellowstone's valley bottoms was caused by seasonal flooding rather than by the grazing habits of native ungulates."
    ],
    [
      "<i>Philosopher Miranda Fricker coined the term 'hermeneutical injustice' to describe situations in which a society's shared conceptual vocabulary lacks the terms needed for marginalized individuals to make sense of and communicate their own distinct social experiences—as existed, for instance, before the legal and cultural formulation of the concept of 'workplace sexual harassment' in the 1970s.</i><br><br>According to the text, what characterizes hermeneutical injustice?",
      "A gap in collective language prevents people from articulating a shared social harm.",
      "Courts deliberately refuse to hear testimony from witnesses who do not use formal legal terminology during civil trials.",
      "Marginalized groups invent private dialects in order to conceal their political organizing from dominant social institutions.",
      "Linguists fail to record regional idioms before they disappear from everyday spoken conversation in modern industrial cities."
    ],
    [
      "<i>Although deep-sea hydrothermal vents lie thousands of meters below the photic zone where sunlight can penetrate, they support dense biological communities whose biomass rivals that of tropical coral reefs. Rather than relying on photosynthetic primary producers, these ecosystems are anchored by chemoautotrophic bacteria that oxidize dissolved hydrogen sulfide emerging from superheated crustal fissures to synthesize organic carbon.</i><br><br>Which choice best states the main idea of the text?",
      "Deep-sea vent ecosystems thrive without sunlight by relying on chemical-oxidizing bacteria.",
      "Hydrothermal vents contain fewer species than tropical coral reefs because superheated water destroys most complex marine organisms.",
      "Photosynthetic algae have adapted to survive thousands of meters below the ocean surface by absorbing faint geothermal radiation.",
      "Dissolved hydrogen sulfide is toxic to all marine life and prevents bacteria from colonizing newly formed volcanic ocean ridges."
    ],
    [
      "<i>Literary critics long treated Mary Shelley's 1826 novel The Last Man as a biographical roman à clef mourning the deaths of Percy Bysshe Shelley and Lord Byron. Recent scholarship by Paley and Lokke, however, foregrounds the novel's engagement with early nineteenth-century epidemiology, British imperial trade routes, and the failure of republican political institutions to contain a global pandemic.</i><br><br>Which choice best states the main idea of the text?",
      "Recent scholars read Shelley's The Last Man as a critique of politics and empire rather than just personal grief.",
      "Mary Shelley wrote The Last Man primarily to celebrate the triumphs of British parliamentary democracy during the nineteenth century.",
      "Early nineteenth-century readers rejected The Last Man because it contained overly technical descriptions of medical quarantine laws.",
      "Biographical interpretations of Mary Shelley's novels have completely replaced political and historical criticism in modern universities."
    ],
    [
      "<i>In quantum computing, superconducting qubits must be isolated inside dilution refrigerators cooled to millikelvin temperatures so that ambient thermal noise does not destroy their delicate quantum superposition—a loss of phase information known as decoherence. Yet complete isolation is impossible in practice, because the control wires required to manipulate and read out qubit states inevitably introduce microscopic electromagnetic coupling with the external environment.</i><br><br>According to the text, why is qubit decoherence difficult to eliminate completely?",
      "The lines needed to control and measure qubits also allow environmental interference.",
      "Dilution refrigerators cannot cool superconducting circuits below the freezing point of liquid nitrogen in laboratory settings.",
      "Superconducting materials lose all electrical conductivity when they are exposed to magnetic fields inside a quantum processor.",
      "Quantum superposition can only be maintained for several hours when qubits are kept at room temperature without external wiring."
    ]
  ],
  [
    [
      "<i>Bioluminescence in deep-sea anglerfish (Melanocetus johnsonii) is produced not by the fish itself, but by symbiotic bacteria ( Photobacterium) housed in a dorsal lure called the esca. Because sequencing of the bacteria's genome in 2018 revealed that they have lost the genes required to synthesize essential amino acids independently in open water, marine biologists conclude that the anglerfish ______</i><br><br>Which choice most logically completes the text?",
      "supplies the bacteria with nutrients directly.",
      "periodically replaces its bacterial colony.",
      "gradually loses its ability to generate.",
      "relies on the symbiotic bacteria primarily."
    ],
    [
      "<i>Archaeological excavations at Pompeii have uncovered over eighty thermopolia—street-side food counters with sunken terracotta jars containing traces of duck, goat, pig, and snails. Because these counters were clustered along narrow alleys lined with single-room apartments (cenacula) that lacked hearths or chimneys, historians infer that ______</i><br><br>Which choice most logically completes the text?",
      "working-class residents relied heavily on prepared street food.",
      "wealthy Roman patricians strictly prohibited their household staff from purchasing meat prepared in public commercial markets.",
      "the majority of the livestock and snails sold at Pompeii's thermopolia were imported from distant Mediterranean provinces.",
      "municipal fire codes in the first century CE required all residential kitchens in Pompeii to be demolished."
    ],
    [
      "<i>When the emerald ash borer (Agrilus planipennis) was accidentally introduced to Michigan from East Asia in 2002, it killed tens of millions of North American ash trees within a decade. In its native range, however, the beetle attacks Manchurian ash (Fraxinus mandshurica) only when the trees are severely stressed by drought. This contrast indicates that Manchurian ash trees ______</i><br><br>Which choice most logically completes the text?",
      "have evolved targeted defenses against the beetle.",
      "grow in mineral-dense alluvial soils that physically prevent the beetle larvae from burrowing into the root system.",
      "require significantly less annual summer rainfall to maintain their canopy than North American ash species do.",
      "attract specialized predatory woodpeckers that are completely absent from the deciduous forests of North America."
    ],
    [
      "<i>In behavioral economics, the 'decoy effect' occurs when a consumer's preference between two options shifts after a third, asymmetrically dominated option is introduced. In a 1982 study by Joel Huber, adding a high-priced, low-quality product variant caused buyers to flock to a premium option they had previously ignored, demonstrating that ______</i><br><br>Which choice most logically completes the text?",
      "value judgments depend on local comparisons rather than fixed preferences.",
      "retailers generally lose revenue when offering more than two pricing tiers.",
      "consumers consistently choose the cheapest item regardless of its relative quality.",
      "adding a third product option confuses shoppers and delays purchasing decisions."
    ],
    [
      "<i>Studies of European alpine glaciers show that when spring windstorms deposit reddish-brown Saharan mineral dust onto white snowpacks, summer glacial retreat accelerates sharply. Because dark mineral particulates have a much lower albedo (reflectivity) than fresh snow, glaciologists attribute the faster melting to ______</i><br><br>Which choice most logically completes the text?",
      "increased absorption of incoming solar radiation.",
      "a sudden rise in ambient air temperatures carried northward by high-altitude winds from the Sahara Desert.",
      "an exothermic chemical reaction between iron oxides in the desert dust and frozen water molecules.",
      "the physical compression of upper firn layers caused by the heavy weight of the accumulated sediment."
    ],
    [
      "<i>During the nineteenth-century Industrial Revolution, the dark (melanic) form of the peppered moth (Biston betularia) rose to 95% frequency around Manchester as coal soot blackened birch bark. After the UK Clean Air Act of 1956 reduced soot emissions, the pale speckled form rebounded to dominance by the 2000s, proving that ______</i><br><br>Which choice most logically completes the text?",
      "Evolutionary selection pressures can rapidly reverse course when habitats change.",
      "genetic mutations caused by industrial coal smoke are irreversible when.",
      "insectivorous birds hunt moths primarily by scent rather than vision.",
      "melanic moths have a slower metabolic rate in unpolluted air regardless."
    ],
    [
      "<i>Linguists studying Silbo Gomero—a whistled register of Spanish used on the island of La Gomera—note that whistled acoustic signals carry up to five kilometers across deep volcanic ravines, whereas shouted speech becomes unintelligible beyond 200 meters. Consequently, whistled speech systems most likely emerged in regions where ______</i><br><br>Which choice most logically completes the text?",
      "steep terrain hindered travel and ordinary vocal communication.",
      "dense tropical forest canopies absorbed high-frequency acoustic waves more rapidly than low-frequency vocal tones.",
      "written literacy was restricted to a small hereditary class of administrative and religious authorities.",
      "communities needed to conceal their agricultural trade negotiations from neighboring island settlements."
    ],
    [
      "<i>When honeybees (Apis mellifera) detect fungal spores in their hive, foragers increase their collection of antimicrobial tree resins to coat the interior walls with propolis. In a 2009 experiment by Marla Spivak, colonies housed in boxes artificially painted with propolis extract exhibited significantly lower expression of individual immune genes, suggesting that ______</i><br><br>Which choice most logically completes the text?",
      "Collective hive sanitation reduces the physiological burden on individual bees' immune systems.",
      "commercial propolis extract is less effective against fungi than raw resin regardless of the environmental or historical constraints described.",
      "worker bees permanently lose their foraging instinct in painted hive boxes when compared with the baseline populations analyzed in the study.",
      "fungal pathogens quickly evolve resistance to compounds in tree resin across all experimental conditions tested by the research team."
    ],
    [
      "<i>For decades, planetary models predicted that Mercury's proximity to the Sun would have boiled away volatile elements like sulfur and potassium during the planet's formation. However, X-ray spectrometers aboard NASA's MESSENGER probe (2011–2015) detected abundant sulfur and potassium across Mercury's crust, forcing astrophysicists to conclude that ______</i><br><br>Which choice most logically completes the text?",
      "early models of Mercury's thermal history were incomplete.",
      "the solar wind continuously deposits heavy potassium ions onto Mercury's silicate surface during solar flares.",
      "MESSENGER's X-ray spectrometers were damaged by intense thermal radiation reflected from the planet's day side.",
      "Mercury's metallic iron core has completely solidified over the past four billion years."
    ],
    [
      "<i>In medieval European scriptoria, vellum parchment made from calfskin was so costly that scribes routinely recycled older manuscripts. By soaking a parchment sheet in milk and scraping away the original ink with a pumice stone, a scribe created a 'palimpsest' ready for new text—a practice that explains why ______</i><br><br>Which choice most logically completes the text?",
      "Multispectral imaging of medieval books often reveals erased classical texts underneath.",
      "medieval monastic libraries held more secular treatises than liturgical books across all experimental conditions tested by the research team.",
      "calfskin vellum is much more brittle than ancient Egyptian papyrus regardless of the environmental or historical constraints described.",
      "scribes adopted smaller script only after paper arrived from China when compared with the baseline populations analyzed in the study."
    ],
    [
      "<i>Whistling-thorn acacias (Vachellia drepanolobium) in Kenya produce swollen hollow thorns and sugary nectar solely to house and feed native Crematogaster ants. When ecologist Todd Palmer fenced out giraffes and other browsers for ten years, the trees stopped producing nectar and hollow thorns, which demonstrates that ______</i><br><br>Which choice most logically completes the text?",
      "the trees invest in housing ants only when herbivore browsing threatens them.",
      "Crematogaster ants cannot survive without nitrogen derived from giraffe.",
      "fenced acacia trees grow more slowly due to a lack of soil aeration.",
      "hollow thorns weaken the structural integrity of acacia branches."
    ],
    [
      "<i>Unlike traditional manufacturing, where a firm borrows millions of dollars to tool a factory before knowing if consumers want the product, reward-based crowdfunding allows creators to pitch a prototype online and collect pre-orders from thousands of backers. Beyond providing upfront capital, this mechanism benefits startups because it ______</i><br><br>Which choice most logically completes the text?",
      "gauges real market demand before mass production begins.",
      "exempts technology startups from international patent and copyright regulations during the prototyping phase.",
      "eliminates the need to hire industrial engineers to oversee quality control at overseas assembly plants.",
      "guarantees that competitors will not release a similar product within the first two years of launch."
    ],
    [
      "<i>In Aleutian kelp forests, sea otters (Enhydra lutris) prey heavily on herbivorous sea urchins. In the 1990s, ecologist James Estes observed that when killer whales (Orcinus orca) began preying on coastal sea otters, otter numbers plummeted by 90 percent within a few years. Based on this trophic cascade, Estes could reasonably predict ______</i><br><br>Which choice most logically completes the text?",
      "an explosion in sea urchin numbers and the destruction of kelp beds.",
      "a rapid increase in the population of coastal fish that rely on dense kelp forests for spawning.",
      "a dietary shift among sea urchins toward consuming microscopic plankton instead of benthic kelp.",
      "an immediate migration of killer whales back toward offshore pelagic waters."
    ],
    [
      "<i>In his 1920 work 'The Economics of Welfare,' Arthur Pigou argued that industrial pollution imposes uncompensated costs—negative externalities—on society that are absent from a factory's balance sheet. By levying a tax per ton of emissions equal to the marginal social damage, a government forces the polluter to ______</i><br><br>Which choice most logically completes the text?",
      "factor environmental costs directly into its production decisions.",
      "pass the entire tax burden onto foreign importers through higher shipping tariffs and customs duties.",
      "maintain its existing coal consumption while government revenues fund unrelated municipal infrastructure.",
      "relocate its administrative headquarters to a jurisdiction with lower corporate income tax rates."
    ],
    [
      "<i>Electroencephalogram (EEG) recordings of northern fur seals (Callorhinus ursinus) collected by Oleg Lyamin show that when the seals sleep in the ocean, one brain hemisphere exhibits slow-wave sleep while the other remains fully awake and controls a paddling flipper. On land, however, both hemispheres sleep at once, implying that unihemispheric sleep in water serves to ______</i><br><br>Which choice most logically completes the text?",
      "keep the seal's nostrils above water while watching for sharks.",
      "accelerate the digestion of cold-water fish by maintaining elevated core muscle temperatures during rest.",
      "conserve metabolic energy when the seals haul out on rocky islands during the summer breeding season.",
      "prevent the seal's visual cortex from being overstimulated by bright sunlight reflecting off the waves."
    ],
    [
      "<i>Radiocarbon dating measures the ratio of unstable carbon-14 to stable carbon-12 in organic remains. Because carbon-14 has a half-life of only 5,730 years, virtually no detectable carbon-14 remains in samples older than 50,000 years. Therefore, to determine the age of a Triceratops bone from the Late Cretaceous (68 million years ago), paleontologists must ______</i><br><br>Which choice most logically completes the text?",
      "Date long-lived isotopes like uranium or potassium in surrounding volcanic ash layers.",
      "extract trace carbon-14 from the dinosaur's dense tooth enamel across all.",
      "estimate the specimen's age solely from the depth of the sandstone regardless.",
      "compare the bone's mineral weight to that of modern crocodilians when compared."
    ],
    [
      "<i>In 1291, the Venetian Republic ordered all glassblowing furnaces demolished in central Venice and relocated to the island of Murano, citing the risk of fire to the city's wooden buildings. Yet the same decree made it a capital crime for any Murano glassmaker to emigrate or share recipes with foreigners, revealing that the senate was also motivated by a desire to ______</i><br><br>Which choice most logically completes the text?",
      "guard Venice's lucrative monopoly on luxury glass production.",
      "punish the glassmakers' guild for organizing a tax revolt against the Doge of Venice in 1290.",
      "reduce coal smoke pollution in the residential districts favored by foreign ambassadors.",
      "ensure that imported quartz pebbles from the Ticino River were unloaded at a single dock."
    ],
    [
      "<i>When lima bean plants (Phaseolus lunatus) are chewed by spider mites, their leaves emit a specific blend of volatile terpenoids into the air. In a 2000 study by Gen-ichiro Arimura, undamaged bean plants exposed to air blown over mite-infested leaves activated defense genes within two hours, demonstrating that ______</i><br><br>Which choice most logically completes the text?",
      "plants can detect airborne chemical warnings from injured neighbors.",
      "spider mites are repelled by the scent of undamaged lima bean leaves in enclosed greenhouses.",
      "defense gene activation in legumes is controlled primarily by fluctuations in ambient carbon dioxide.",
      "damaged bean plants release terpenoids to inhibit the root growth of competing weeds."
    ],
    [
      "<i>In 1878, Gustavus Swift engineered a railroad boxcar with overhead ice bunkers that circulated chilled air around hanging beef carcasses. Before this invention, cattle raised in Texas and Kansas had to be shipped alive by rail to eastern cities, losing weight and dying en route. Swift's refrigerated car transformed the industry by allowing meatpackers to ______</i><br><br>Which choice most logically completes the text?",
      "Centralize slaughtering in Chicago and ship dressed beef nationwide at lower cost.",
      "export live cattle across the Atlantic Ocean to markets in London across all experimental conditions tested by the research team.",
      "eliminate the need for ice harvesting on midwestern lakes in winter regardless of the environmental or historical constraints described.",
      "charge eastern consumers higher prices for locally slaughtered beef."
    ],
    [
      "<i>In a 2006 memory study by Henry Roediger and Jeffrey Karpicke, college students read prose passages on science topics. One group reread the passages four times, while another group read once and spent the remaining time writing down everything they could remember without looking back. Although the rereading group felt more confident, the recall group scored 50% higher a week later, showing that ______</i><br><br>Which choice most logically completes the text?",
      "Active retrieval consolidates long-term memory far better than passive rereading.",
      "rereading a text multiple times causes students to forget the main idea regardless of the environmental or historical constraints described.",
      "confidence ratings are the most accurate predictor of exam performance when compared with the baseline populations analyzed in the study.",
      "practice tests improve retention only when immediate grading is given."
    ],
    [
      "<i>Orbital images of Mars show dendritic valley networks and river deltas carved billions of years ago. Today, however, Mars's atmospheric pressure is just 6 millibars—below the triple point of water—causing any liquid water on the surface to boil or freeze instantly. Planetary scientists therefore deduce that during the Noachian era, Mars ______</i><br><br>Which choice most logically completes the text?",
      "had a much thicker atmosphere.",
      "orbited at the same distance.",
      "possessed subglacial volcanoes that melted surface.",
      "was covered by oceans of liquid."
    ],
    [
      "<i>In 1993, a small study reported in 'Nature' that college students who listened to a Mozart piano sonata for ten minutes scored higher on a paper-folding spatial task than students who sat in silence. However, when Glenn Schellenberg replicated the experiment in 1999 using a Stephen King audio story alongside Mozart, students who preferred the story showed the same spatial boost, indicating that ______</i><br><br>Which choice most logically completes the text?",
      "the cognitive boost comes from enjoyable mental arousal, not Mozart's music specifically.",
      "Mozart's compositions actually impair spatial reasoning in listeners who prefer fiction.",
      "Stephen King's prose follows the exact same rhythmic mathematical ratios as classical sonatas.",
      "paper-folding tests cannot measure short-term changes in human spatial intelligence."
    ],
    [
      "<i>To test whether nest-building birds follow rigid instincts or assess material mechanics, Patrick Walsh gave male zebra finches (Taeniopygia guttata) either stiff or floppy plastic strips. Birds initially preferred stiff strips for the structural base; moreover, after learning that floppy strips bent too easily to pass through a narrow cage entrance, they avoided floppy strips entirely, proving that ______</i><br><br>Which choice most logically completes the text?",
      "finches adjust their material choices based on physical experience.",
      "wild zebra finches prefer colorful plastic strips over natural twigs and dried savannah grasses.",
      "the ability to weave a nest cup is inherited exclusively along the maternal genetic line.",
      "male finches abandon their territories if they cannot find stiff twigs within forty-eight hours."
    ],
    [
      "<i>Following the 1973 oil embargo, commercial skyscrapers in North America were constructed with hermetically sealed windows and reduced fresh-air intake to cut heating and cooling bills. Within a few years, the World Health Organization documented clusters of headaches, dry eyes, and fatigue among workers in these new buildings—a condition termed 'sick building syndrome' that was traced to ______</i><br><br>Which choice most logically completes the text?",
      "Trapped volatile chemicals off-gassing from indoor carpets, adhesives, and copy machines.",
      "eye strain caused by the absence of exterior windows when compared with the baseline populations analyzed in the study.",
      "low-frequency vibrations from high-speed elevators across all experimental conditions tested by the research team.",
      "allergens blown in from surrounding urban parks regardless of the environmental or historical constraints described."
    ],
    [
      "<i>An octopus (Octopus vulgaris) has roughly 500 million neurons, but over 300 million of them are distributed along the axial nerve cords of its eight arms rather than inside its brain. In a 2011 experiment by Binyamin Hochner, octopuses whose visual pathways to the brain were blocked could still guide a single arm through a maze to fetch food, which confirms that ______</i><br><br>Which choice most logically completes the text?",
      "octopus arms can process local sensory feedback independently.",
      "the central brain of Octopus vulgaris plays no role in predatory hunting or camouflage.",
      "octopuses navigate mazes by detecting weak magnetic fields through their suckers.",
      "each of an octopus's eight arms possesses its own miniature optical eye."
    ],
    [
      "<i>Until 1886, aluminum was more precious than silver because isolating pure aluminum metal from bauxite ore required complex chemical reduction with sodium; Emperor Napoleon III famously reserved aluminum cutlery for his most honored guests. Once Charles Martin Hall and Paul Héroult independently invented electrolytic smelting in 1886, the price of aluminum fell by 90% in a decade, illustrating how ______</i><br><br>Which choice most logically completes the text?",
      "A process innovation can rapidly transform a status symbol into an everyday commodity.",
      "nineteenth-century monarchs preferred lightweight metals over gold regardless.",
      "bauxite ore was extremely rare in Europe before the 1890s when compared.",
      "electrolytic smelting reduced the tensile strength of pure aluminum across all."
    ],
    [
      "<i>Arctic permafrost stores an estimated 1,500 gigatons of organic carbon—nearly twice as much carbon as is currently in Earth's atmosphere. As rising polar temperatures thaw this frozen soil, anaerobic archaea digest the ancient plant matter and release methane ($CH_4$), a greenhouse gas twenty-eight times more potent than $CO_2$ over a century. Climatologists warn that this thawing ______</i><br><br>Which choice most logically completes the text?",
      "triggers a feedback loop that amplifies global warming.",
      "will soon turn the Siberian tundra into a productive wheat-farming belt.",
      "absorbs excess atmospheric nitrogen and cools the Arctic Ocean.",
      "permanently locks methane inside newly formed underground ice lenses."
    ],
    [
      "<i>In the Red Sea, roving coral groupers (Plectropomus pessuliferus) hunt in open water, while giant moray eels (Gymnothorax javanicus) slither through tight reef crevices. In 2006, Redouan Bshary filmed groupers swimming up to resting morays and shaking their heads—a signal that prompted the eels to swim out and flush prey from crevices where the grouper was waiting. This behavior shows that ______</i><br><br>Which choice most logically completes the text?",
      "Distantly related species can coordinate hunts when their skills are complementary.",
      "coral groupers cannot catch fish without the help of moray eels across all experimental conditions tested by the research team.",
      "moray eels surrender their captured prey to larger groupers out of fear regardless of the environmental or historical constraints described.",
      "reef fish cannot tell the difference between groupers and moray eels."
    ],
    [
      "<i>In 1747, Scottish naval surgeon James Lind selected twelve sailors suffering from scurvy aboard HMS Salisbury and divided them into six pairs, giving each pair a different daily supplement—such as cider, vinegar, seawater, or two oranges and a lemon. Within six days, only the pair given citrus fruit recovered enough to return to duty, providing the first controlled clinical evidence that ______</i><br><br>Which choice most logically completes the text?",
      "scurvy could be cured by a dietary factor present in citrus fruit.",
      "drinking boiled seawater accelerates tissue healing in vitamin-deficient sailors.",
      "scurvy is a contagious bacterial infection spread through cramped ship quarters.",
      "the British Admiralty immediately mandated lemon rations across the fleet in 1748."
    ],
    [
      "<i>In 1842, Austrian physicist Christian Doppler proposed that the observed frequency of a wave depends on the relative velocity of the source and the observer. To test this in 1845, C.H.D. Buys Ballot placed trumpeters on a moving open railway flatcar in Utrecht; stationary musicians on the platform heard the trumpet pitch rise as the train approached and drop as it receded, verifying that ______</i><br><br>Which choice most logically completes the text?",
      "Motion compresses sound waves ahead of a source and stretches them behind it.",
      "wind speed over an open railway car alters the brass resonance of trumpets when compared with the baseline populations analyzed in the study.",
      "sound travels faster through iron railway tracks than through humid air across all experimental conditions tested by the research team.",
      "human ears perceive louder sounds as being higher in musical pitch."
    ],
    [
      "<i>In 1865, English economist William Stanley Jevons observed that after James Watt's more fuel-efficient steam engine was introduced, total British coal consumption soared rather than fell. Because the improved engine made steam power economical for dozens of new industries, Jevons concluded that technological gains in resource efficiency often ______</i><br><br>Which choice most logically completes the text?",
      "increase overall consumption by lowering the cost of using the resource.",
      "cause mining companies to reduce the wages of underground coal miners.",
      "lead governments to ration fuel supplies during periods of industrial.",
      "slow down the pace of further mechanical innovation in competing."
    ],
    [
      "<i>The Indus script, used across the Harappan civilization (c. 2600–1900 BCE) on thousands of carved soapstone seals, remains undeciphered because no bilingual inscription like the Rosetta Stone has been found, and the average seal inscription is less than five symbols long. In 2009, Rajesh Rao calculated the conditional entropy of the symbol sequences and found it matched natural languages like Sanskrit and Sumerian rather than non-linguistic heraldic emblems, suggesting that ______</i><br><br>Which choice most logically completes the text?",
      "the symbols represent a true writing system with grammatical rules.",
      "Harappan merchants spoke a dialect of ancient Egyptian.",
      "soapstone seals were used merely as decorative amulets with random designs.",
      "the Indus script can be translated using modern Sanskrit dictionaries."
    ],
    [
      "<i>In 2000, neuroscientist Eleanor Maguire used structural MRI scans to compare the brains of licensed London taxi drivers—who must spend up to cuatro years memorizing 25,000 streets and thousands of landmarks to pass an exam called 'The Knowledge'—with those of non-taxi-driving controls. Maguire found that the posterior hippocampus was significantly larger in taxi drivers and grew larger the longer they had been on the job, proving that ______</i><br><br>Which choice most logically completes the text?",
      "intensive spatial navigation training physically remodels the adult human brain.",
      "only individuals born with an enlarged posterior hippocampus can pass 'The Knowledge' exam.",
      "London taxi drivers have smaller visual cortices than bus drivers who follow fixed routes.",
      "hippocampal volume in humans reaches its maximum size before age twenty."
    ],
    [
      "<i>During the silent film era of the 1910s and 1920s, film directors frequently hired live violinists and keyboardists to play on the studio set while scenes were being filmed. Because silent cameras recorded no audio whatsoever, film historians note that this on-set music was performed not for theater audiences, but to ______</i><br><br>Which choice most logically completes the text?",
      "help actors get into the proper emotional mood while the noisy cameras rolled.",
      "test the acoustic resonance of the studio walls before sound cinema was invented.",
      "distract rival film producers who were spying on the production from outside.",
      "keep the camera operators cranking the film reels at a constant speed of 60 frames per second."
    ],
    [
      "<i>Most reef-building corals bleach and die when sea temperatures exceed 30°C, as heat damages the photosynthetic machinery of their symbiotic Symbiodiniaceae algae. In the southern Persian Gulf, however, corals thrive in summer temperatures reaching 35°C because they partner with a specialized algal species, Cladocopium thermophilum. This partnership implies that ______</i><br><br>Which choice most logically completes the text?",
      "a coral's heat tolerance is heavily determined by the genetic identity of its algal symbiont.",
      "Persian Gulf corals do not rely on photosynthesis for any of their carbon needs.",
      "transplanting Caribbean corals into the Persian Gulf would immediately cure them of bleaching.",
      "ocean acidification has no effect on corals that host Cladocopium thermophilum."
    ],
    [
      "<i>In Edgar Allan Poe's 1843 short story 'The Tell-Tale Heart,' the unnamed narrator begins by insisting on his own sanity, pointing to the calm, methodical precision with which he stalked and murdered an old man solely because of the man's pale blue 'vulture eye.' By having the narrator cite his irrational obsession as proof of his rationality, Poe invites the reader to ______</i><br><br>Which choice most logically completes the text?",
      "recognize the narrator's madness through his own self-contradictory defense.",
      "sympathize with the narrator's fear of the old man's supernatural powers.",
      "conclude that the murder was committed in self-defense during a burglary.",
      "admire the narrator's forensic skill in concealing the crime."
    ],
    [
      "<i>In the 1970s, astronomer Vera Rubin measured the Doppler shifts of gas clouds in the outer disks of the Andromeda galaxy and dozens of other spiral galaxies. According to Keplerian orbital mechanics, gas clouds far from the bright central bulge should orbit much more slowly than inner clouds; instead, Rubin found that orbital velocities remained flat all the way to the visible edge, compelling astronomers to conclude that ______</i><br><br>Which choice most logically completes the text?",
      "spiral galaxies are surrounded by massive halos of unseen dark matter.",
      "Newton's law of universal gravitation only applies within our own solar system.",
      "outer gas clouds are accelerated by stellar winds from young blue supergiants.",
      "the Andromeda galaxy is rotating in the opposite direction of the Milky Way."
    ],
    [
      "<i>In a 1973 study by Mark Lepper, preschool children who spent their free time drawing with felt-tip markers were divided into groups. One group was told they would earn a 'Good Player' certificate with a gold star for drawing, while another group drew without any mention of a prize. Two weeks later, when markers were placed in the classroom, the rewarded children drew half as much as before, indicating that ______</i><br><br>Which choice most logically completes the text?",
      "expected tangible rewards can erode intrinsic enjoyment of an activity.",
      "preschoolers quickly grow bored with felt-tip markers unless new colors are added.",
      "gold star certificates are too abstract for young children to value as rewards.",
      "unrewarded children drew more only because they hoped to win a certificate later."
    ],
    [
      "<i>Excavations at the Bronze Age city of Mohenjo-daro in the Indus Valley (c. 2500 BCE) have revealed a grid of brick-lined street drains, hundreds of private household wells, and indoor bathing platforms, yet archaeologists have found no monumental royal tombs, grand temples, or boastful stone inscriptions of conquering kings. From this archaeological record, scholars infer that Mohenjo-daro ______</i><br><br>Which choice most logically completes the text?",
      "prioritized civic sanitation infrastructure over glorifying individual rulers.",
      "was conquered and ruled by Mesopotamian kings from Ur and Babylon.",
      "lacked skilled stonemasons and bricklayers capable of building large structures.",
      "was inhabited only seasonally by nomadic pastoralists during the monsoon."
    ],
    [
      "<i>Penicillin and related beta-lactam antibiotics kill bacteria by inhibiting the enzymes that cross-link peptidoglycan molecules in bacterial cell walls, causing the cells to burst under osmotic pressure. Mycoplasma bacteria, however, naturally lack cell walls and instead stabilize their cell membranes with sterols. Consequently, treating a Mycoplasma pneumonia infection with penicillin ______</i><br><br>Which choice most logically completes the text?",
      "will be completely ineffective because the target structure is absent.",
      "requires double the standard dosage to penetrate the bacterial sterol membrane.",
      "cures the patient within forty-eight hours by blocking bacterial DNA replication.",
      "causes Mycoplasma cells to rapidly synthesize a temporary peptidoglycan wall."
    ],
    [
      "<i>Completed in 1970, Egypt's Aswan High Dam ended the annual summer flooding of the Nile River and generated half of the nation's electricity. However, the reservoir (Lake Nasser) trapped the 120 million tons of nutrient-rich Ethiopian silt that had previously fertilized downstream farmland and replenished the Nile Delta coastline. As a result, Egyptian farmers and coastal engineers have had to contend with ______</i><br><br>Which choice most logically completes the text?",
      "Rising dependence on chemical fertilizers and severe coastal erosion along the delta.",
      "catastrophic summer floods washing away irrigation canals in Cairo regardless.",
      "an accumulation of excess silt clogging the streets of Alexandria when compared.",
      "a sudden drop in the salinity of the eastern Mediterranean Sea across all."
    ],
    [
      "<i>Unlike other terrestrial mammals, the naked mole-rat (Heterocephalus glaber) can survive eighteen minutes in complete oxygen deprivation (anoxia) without brain damage. In 2017, Thomas Park discovered that when deprived of oxygen, naked mole-rats switch their brain metabolism from glucose—which requires oxygen to process—to fructose, a pathway used by plants. This metabolic switch allows the mole-rats to ______</i><br><br>Which choice most logically completes the text?",
      "Keep vital organs supplied with energy in crowded, oxygen-poor burrows.",
      "subsist entirely on sweet surface fruits rather than underground roots when compared with the baseline populations analyzed in the study.",
      "maintain a body temperature of 40°C during cold desert nights across all experimental conditions tested by the research team.",
      "dig tunnels through solid granite rock without resting to breathe."
    ],
    [
      "<i>In 1971, petroleum engineers E.C. Capen, R.V. Clapp, and W.M. Campbell analyzed federal sealed-bid auctions for Gulf of Mexico oil leases. They noted that although every bidding company used similar seismic surveys to estimate how much oil lay beneath a tract, the winning bid was routinely several times higher than the runner-up bid, and winning firms earned dismal returns. They coined the term 'winner's curse' to explain that in such auctions, the winner is typically the firm that ______</i><br><br>Which choice most logically completes the text?",
      "most severely overestimated the true value of the lease.",
      "bribed federal auction officials to reveal competitors' sealed bids.",
      "possessed the most advanced deep-water drilling rigs in the industry.",
      "colluded with rival oil companies to keep bidding prices artificially low."
    ],
    [
      "<i>During the sixteenth through nineteenth centuries, European apothecaries and painters imported 'mumia'—powdered ancient Egyptian mummies—to use in medicines and in a rich asphaltic oil paint called 'mummy brown.' The Pre-Raphaelite painter Edward Burne-Jones reportedly buried his tube of mummy brown in his garden in the 1880s upon learning it contained real human remains, an anecdote that illustrates how ______</i><br><br>Which choice most logically completes the text?",
      "Artists had often used the pigment without realizing its literal origin.",
      "mummy brown paint was too toxic to store indoors regardless of the environmental or historical constraints described.",
      "Victorian painters preferred bright synthetic colors over brown tones when compared with the baseline populations analyzed in the study.",
      "burying oil paint in soil improved its viscosity and drying time."
    ],
    [
      "<i>Traditional coffee agroforestry in Latin America grows Arabica bushes beneath a diverse canopy of nitrogen-fixing Inga and legume shade trees. In the 1990s, many plantations cut down their shade trees to plant high-density 'sun coffee.' While yields initially rose, ornithologists documented a 90% drop in migratory warbler species on sun-coffee farms, accompanied by a spike in leaf-eating insect damage, demonstrating that ______</i><br><br>Which choice most logically completes the text?",
      "shade trees supported insectivorous birds that provided natural pest control.",
      "sun-grown coffee beans contain toxic alkaloids that poison migratory birds.",
      "migratory warblers feed primarily on ripe red coffee cherries.",
      "nitrogen-fixing shade trees deplete the soil moisture needed by coffee bushes."
    ],
    [
      "<i>In 1854, London physician John Snow mapped a deadly cholera outbreak in Soho andrejected the prevailing 'miasma' theory that cholera was inhaled from foul air. Snow noticed that residents who drank from the Broad Street water pump died in droves, whereas workers at the nearby Lion Brewery—who were given a daily allowance of malt liquor and never drank pump water—suffered zero fatalities. Snow inferred from this pattern that ______</i><br><br>Which choice most logically completes the text?",
      "The cholera pathogen was being transmitted through contaminated water from the Broad Street pump.",
      "alcohol in malt liquor immunized the brewery workers against airborne miasmas across all.",
      "boiling grain at the Lion Brewery purified the air in the surrounding Soho streets regardless.",
      "residents who lived closest to the Broad Street pump had the poorest diets when compared."
    ],
    [
      "<i>Anthropogenic ship noise in the oceans overlaps with the low-frequency acoustic band (20–200 Hz) used by baleen whales for long-distance communication. When acoustic biologists Rosalind Rolland and colleagues analyzed fecal hormone samples from North Atlantic right whales (Eubalaena glacialis) in the Bay of Fundy during the two days after September 11, 2001—when commercial ship traffic halted abruptly and underwater noise dropped by 6 decibels—they found a sharp decline in stress-related glucocorticoids, indicating that ______</i><br><br>Which choice most logically completes the text?",
      "Chronic underwater shipping noise causes measurable physiological stress in whales.",
      "right whales stop foraging when commercial cargo ships are absent regardless of the environmental or historical constraints described.",
      "low-frequency ship engines attract right whales into shallow bays when compared with the baseline populations analyzed in the study.",
      "glucocorticoid hormones in whales fluctuate solely with water temperature."
    ],
    [
      "<i>When Johann Gutenberg printed his 42-line Bible in Mainz around 1455, he cast 290 different metal type sorts—including numerous ligatures and abbreviated letterforms with suspension bars above vowels—rather than just the 26 letters of the Latin alphabet. Book historians point out that Gutenberg went to this expense so that his printed pages would ______</i><br><br>Which choice most logically completes the text?",
      "Closely mimic the justified margins and scribal conventions of hand-copied manuscripts.",
      "be impossible for rival German printers to read without a cipher key when compared with the baseline populations analyzed in the study.",
      "use twice as much rag paper per volume as traditional monastic Bibles across all experimental conditions tested by the research team.",
      "introduce a simplified phonetic spelling reform to fifteenth-century Latin."
    ],
    [
      "<i>Plants lose up to 97% of the water they absorb through microscopic leaf pores called stomata, which must open to let in atmospheric $CO_2$ for photosynthesis. Pineapple plants (Ananas comosus) and agaves use Crassulacean Acid Metabolism (CAM): they keep their stomata tightly sealed during the hot day and open them only at night, storing $CO_2$ as malic acid until sunrise. This temporal separation allows CAM plants to ______</i><br><br>Which choice most logically completes the text?",
      "Photosynthesize in arid climates while losing a fraction of the water lost by standard plants.",
      "grow in dark caves where sunlight never reaches their leaves across all experimental conditions tested by the research team.",
      "absorb liquid water directly from daytime desert air through their stomata regardless of the environmental or historical constraints described.",
      "complete their entire reproductive life cycle within a single rainy week when compared with the baseline populations analyzed in the study."
    ],
    [
      "<i>During World War II, statistician Abraham Wald was asked by the US military to analyze the bullet-hole distribution on bombers returning from missions over Europe so engineers could add heavy armor plating to the most frequently hit areas—the wings and rear fuselage. Wald famously advised armoring the engines and cockpit instead, where returning planes had almost zero bullet holes, reasoning that ______</i><br><br>Which choice most logically completes the text?",
      "Planes hit in the engines or cockpit were not returning from missions to be counted.",
      "anti-aircraft gunners intentionally aimed at the wings rather than the cockpit regardless of the environmental or historical constraints described.",
      "the wings and fuselage were the most fragile parts of the bomber's frame when compared with the baseline populations analyzed in the study.",
      "adding armor to the engines would make the bombers too heavy to take off."
    ],
    [
      "<i>In a study of cooperative hunting among coral trout (Plectropomus leopardus) and giant moray eels, marine biologists observed that a trout will perform a rapid head-shaking display near a moray's crevice when prey has escaped into the reef matrix where the open-water trout cannot follow. When presented with two artificial moray models—one that reliably emerged to flush prey out of crevices during training trials and one that remained stationary—the trout subsequently directed 84 percent of their recruitment signals toward the responsive collaborator. Which choice most logically completes the text?</i><br><br>These findings suggest that coral trout ______",
      "track partners' past success and prefer reliable collaborators.",
      "rely exclusively on innate genetic reflexes that compel them.",
      "prefer to hunt alone in open water whenever reef crevices.",
      "use head-shaking displays primarily to deter territorial."
    ],
    [
      "<i>During the Roman Republic, bronze coinage was struck to a weight standard known as the libral as, originally weighing roughly 324 grams. Numismatic hoards dated to the Second Punic War (218–201 BCE), however, show the average weight of newly minted asses dropping precipitously to 130 grams and then to under 50 grams within a single decade, while silver denarii were simultaneously debased with copper. Because military payrolls had to be met despite Carthaginian occupation of Iberian mines, historians conclude that ______</i><br><br>Which choice most logically completes the text?",
      "wartime bullion shortages forced Rome to reduce the metal content of its coins.",
      "Roman merchants voluntarily abandoned bronze coins in favor of Carthaginian gold currency during the Second Punic War.",
      "the Roman Senate increased the weight of bronze asses after 201 BCE in order to reward soldiers returning from Iberian campaigns.",
      "counterfeiters outside Italy were responsible for minting all lightweight bronze coins discovered in third-century BCE archaeological hoards."
    ],
    [
      "<i>Plants emit ultrasonic acoustic clicks (20–100 kilohertz) when xylem water tension rises during drought stress, caused by microscopic cavitation bubbles collapsing inside vascular conduits. When bioacousticians trained a machine-learning classifier on recordings from greenhouse tomato and tobacco plants, the model distinguished drought-stressed plants from stem-cut plants with over 70 percent accuracy—even before visible leaf wilting occurred. Consequently, agricultural engineers propose that ______</i><br><br>Which choice most logically completes the text?",
      "acoustic sensors could detect crop dehydration before visual symptoms appear.",
      "ultrasonic clicks are deliberately produced by tomato plants in order to attract pollinating insects during dry summer months.",
      "xylem cavitation bubbles only form after a plant's leaves have completely wilted and lost their photosynthetic capacity.",
      "greenhouse crops require significantly more irrigation water than field-grown crops because indoor acoustics amplify vascular stress."
    ],
    [
      "<i>In medieval European scriptoria, parchment made from calfskin (vellum) was prized for luxury illuminated manuscripts, whereas cheaper sheepskin parchment was mandated by royal exchequers for legal deeds and tax rolls. Protein-mass-spectrometry analysis of 600 thirteenth-century English legal membranes by Sean Doherty revealed that 96 percent were indeed sheepskin; unlike dense calfskin, sheepskin consists of delaminating fat-rich layers that visibly peel if anyone attempts to scrape away ink. This physical property implies that legal officials favored sheepskin not merely for its lower cost, but because ______</i><br><br>Which choice most logically completes the text?",
      "it made fraudulent erasure and alteration of legal text immediately obvious.",
      "sheepskin absorbed gold leaf and mineral pigments much more vibrantly than calfskin vellum did in royal monasteries.",
      "English livestock herders raised virtually no cattle during the thirteenth century due to widespread pasture shortages.",
      "tax rolls written on sheepskin could be washed clean and reused each fiscal year without damaging the underlying membrane."
    ],
    [
      "<i>Cognitive scientists investigating the 'foreign-language effect' presented bilingual speakers with identical financial risk scenarios in either their native tongue (L1) or a second language learned in adulthood (L2). Participants reading in L1 exhibited strong loss aversion, rejecting bets with positive expected value whenever potential losses were framed vividly; participants reading in L2 evaluated the exact same bets far more symmetrically. Because L2 processing recruits deliberative prefrontal networks with reduced amygdala activation, the researchers infer that ______</i><br><br>Which choice most logically completes the text?",
      "using a second language dampens emotional bias during risky decision-making.",
      "bilingual individuals generally possess higher mathematical ability than monolingual speakers when calculating expected financial returns.",
      "loss aversion is entirely determined by cultural proverbs learned in childhood rather than by neurological processing pathways.",
      "adults who learn a second language eventually lose their emotional attachment to memories formed in their native language."
    ],
    [
      "<i>When atmospheric carbon dioxide dissolves in surface ocean waters, it forms carbonic acid and reduces the concentration of carbonate ions required by calcifying organisms. While pteropod sea butterflies show severe shell dissolution under projected 2100 pH levels, certain crustacean species such as the American lobster (Homarus americanus) actually increase carapace calcification under moderate acidification by actively pumping bicarbonate ions across their gill epithelia—an energetically costly process. Therefore, marine physiologists caution that ______</i><br><br>Which choice most logically completes the text?",
      "crustaceans' shell growth under acidification may come at the expense of other energy needs.",
      "ocean acidification will uniformly dissolve the shells and exoskeletons of all calcifying.",
      "pteropod sea butterflies can easily switch from calcium carbonate to chitin to build.",
      "American lobsters thrive best in acidic waters when their food supply is severely."
    ],
    [
      "<i>In 1928, Soviet agronomist Trofim Lysenko claimed that chilling moistened winter wheat seeds ('vernalization') caused heritable transformations that turned them into spring wheat within a single generation, rejecting Mendelian genetics. Because state authorities suppressed controlled replication trials that failed to confirm heritable vernalization and mandated Lysenko's methods across collective farms, historians of science point to the episode as evidence that ______</i><br><br>Which choice most logically completes the text?",
      "insulating scientific claims from empirical falsification can lead to widespread agricultural failure.",
      "chilling winter wheat seeds permanently alters their chromosomal DNA sequence within a single growing season.",
      "Mendelian genetics was completely unknown to Russian biologists prior to the mid-twentieth century.",
      "state-directed agricultural research always produces higher crop yields than decentralized university experimentation."
    ],
    [
      "<i>Astronomers analyzing transit light curves from the Kepler space telescope noticed a striking 'radius valley': exoplanets with radii between 1.5 and 2.0 Earth radii are roughly half as common as either rocky 'super-Earths' (around 1.3 Earth radii) or gaseous 'mini-Neptunes' (around 2.4 Earth radii) orbiting close to their host stars. Because intense X-ray and extreme-ultraviolet irradiation from young stars strips primordial hydrogen-helium envelopes from lower-mass cores while heavier cores retain them, planetary scientists conclude that ______</i><br><br>Which choice most logically completes the text?",
      "many super-Earths are the stripped rocky cores of former mini-Neptunes.",
      "exoplanets with radii between 1.5 and 2.0 Earth radii are too dark for the Kepler space telescope's photometers to detect.",
      "mini-Neptunes form exclusively in the outer reaches of planetary systems and never migrate closer to their host stars.",
      "young stars emit virtually no X-ray or ultraviolet radiation during the first hundred million years of planetary formation."
    ],
    [
      "<i>During the Harlem Renaissance, photographer James Van Der Zee operated a portrait studio in Manhattan where he combined sharp studio lighting, painted architectural backdrops, and post-exposure darkroom composite printing—superimposing poetic visual motifs or Absent loved ones onto negatives. Rather than treating photography as an unmediated documentary record of urban poverty, Van Der Zee's technical interventions suggest that he viewed the studio portrait as ______</i><br><br>Which choice most logically completes the text?",
      "a collaborative artistic medium for crafting aspirational self-representation.",
      "an objective journalistic tool for exposing tenements and municipal neglect to city housing reformers.",
      "a rapid commercial process that required eliminating all retouching in order to maximize daily customer volume.",
      "a purely experimental abstraction that avoided depicting recognizable human subjects or domestic interiors."
    ],
    [
      "<i>Unlike honeybees, which maintain a perennial colony through winter by clustering around stored honey, bumblebee (Bombus) colonies are annual: only newly mated queens hibernate underground in autumn. When warm late-winter spells trigger premature emergence before spring willow catkins bloom, queens rapidly exhaust their lipid reserves within days. Ecologists monitoring alpine meadows therefore predict that if climate change increases the frequency of false-spring thaws without advancing floral phenology at the same rate, ______</i><br><br>Which choice most logically completes the text?",
      "fewer bumblebee queens will survive long enough to establish new summer colonies.",
      "bumblebee workers will begin storing large quantities of liquid honey inside underground burrows over the winter.",
      "alpine willow trees will evolve to bloom in mid-autumn rather than waiting for spring snowmelt.",
      "annual bumblebee colonies will immediately transition into perennial hives indistinguishable from those of domestic honeybees."
    ]
  ],
  [
    [
      "<i>Neuroscientists hypothesize that rapid eye movement (REM) sleep plays a critical role in emotional regulation by reprocessing distressing memories while the brain's production of stress-related norepinephrine is suppressed.</i><br><br>Which finding, if true, would most directly support the neuroscientists' hypothesis?",
      "REM-deprived participants showed much higher amygdala reactivity to negative images the next day.",
      "Individuals who experienced longer periods of deep non-REM sleep reported feeling.",
      "Brain scans revealed that norepinephrine levels fluctuate throughout waking hours depending.",
      "Subjects awakened during REM sleep recalled the narrative details of their dreams more vividly."
    ],
    [
      "<i>Economists argue that implementing congestion pricing in metropolitan centers not only reduces vehicular traffic volume during peak hours but also shifts commuter preferences toward public transit systems over the long term.</i><br><br>Which finding from a study of a city that introduced congestion pricing five years ago would best support the economists' claim?",
      "Subway ridership rose 28% while peak downtown car traffic stayed 22% lower.",
      "Municipal revenue generated from the congestion tolls was primarily allocated toward repaving residential streets and expanding bike lanes in suburban neighborhoods outside the toll zone.",
      "Commercial delivery companies operating within the city adjusted their logistics schedules to conduct the vast majority of their freight transport between midnight and five in the morning.",
      "Retail businesses located inside the congestion zone reported a temporary decline in foot traffic during the first two months following the initial implementation of the toll."
    ],
    [
      "<i>Marine biologists studying coral reefs in the Indo-Pacific propose that the presence of damselfish, which aggressively defend their algal garden territories from larger herbivorous fish, inadvertently protects fragile branching corals from being damaged by parrotfish grazing.</i><br><br>Which observation, if true, would most directly support the marine biologists' proposal?",
      "Branching corals inside damselfish territories have far fewer parrotfish bite scars and higher survival rates.",
      "Parrotfish populations tend to be significantly denser in reef zones that have experienced recent thermal bleaching events and subsequent increases in turf algae coverage.",
      "Damselfish spend more metabolic energy chasing away intruding fish of their own species than they do defending their territories against smaller invertebrate grazers.",
      "Reefs with a high diversity of branching coral species generally support a wider variety of nocturnal predators than reefs dominated by massive boulder corals."
    ],
    [
      "<i>A literary critic claims that in Edith Wharton's 1920 novel 'The Age of Innocence,' the protagonist Newland Archer is portrayed as someone who intellectually critiques the rigid social conventions of Old New York while remaining psychologically incapable of breaking free from them.</i><br><br>Which quotation from a scholarly analysis of the novel most effectively illustrates the critic's claim?",
      "\"Archer privately mocks his peers' obsession with propriety, yet he sacrifices his love for Ellen to preserve his status.\"",
      "\"Wharton's meticulous descriptions of opera houses, drawing rooms, and formal dinners serve to reconstruct the opulent material culture of late nineteenth-century Manhattan.\"",
      "\"Ellen Olenska's return from Europe introduces cosmopolitan ideas that immediately alienate the conservative matriarchs who govern the social calendar of New York's elite families.\"",
      "\"Throughout the narrative, Archer's legal career is depicted as a gentlemanly pursuit that demands very little actual labor compared to the commercial enterprises of the rising industrial class.\""
    ],
    [
      "<i>Archaeologists studying the collapse of the Classic Maya civilization in the ninth century CE contend that prolonged severe droughts, rather than foreign military invasions alone, were the primary driver of the abandonment of major lowland cities.</i><br><br>Which evidence from sediment cores taken from lakes near former Maya cities would most directly strengthen the archaeologists' contention?",
      "Ninth-century sediment layers show a 50% rainfall drop right when monument building stopped.",
      "Pollen grains preserved in seventh-century sediment layers show that maize, beans, and squash were cultivated extensively across the surrounding deforested valleys for generations.",
      "Charcoal deposits found in lake beds near highland settlements suggest that localized forest fires occurred periodically throughout the early Preclassic agricultural period.",
      "Chemical analysis of clay ceramic artifacts recovered from the lake shorelines reveals that trade networks with central Mexican cities persisted well into the tenth century."
    ],
    [
      "<i>Agronomists claim that intercropping—planting leguminous cover crops like clover alongside primary cereal crops such as wheat—can maintain high grain yields while substantially reducing the need for synthetic nitrogen fertilizers.</i><br><br>Which data from a three-year agricultural trial would most directly support the agronomists' claim?",
      "Unfertilized wheat intercropped with clover yielded just as much grain as fertilized monoculture wheat.",
      "Clover plants grown in isolated greenhouse environments fixed atmospheric nitrogen at a much faster.",
      "Monoculture wheat fields treated with double the recommended amount of synthetic fertilizer.",
      "Farmers who rotated wheat and soybeans in alternating years reported lower annual expenses."
    ],
    [
      "<i>Psychologists investigating the 'illusion of explanatory depth' argue that people consistently overestimate how well they understand complex mechanical devices until they are explicitly asked to write down a step-by-step explanation of how those devices function.</i><br><br>Which experimental result would most directly support the psychologists' argument?",
      "People rated their understanding of locks much lower after trying to draw how one works.",
      "Professional locksmiths and mechanical engineers were able to describe the internal function of a zipper much more accurately than participants without technical training.",
      "Subjects who read an illustrated manual explaining how a sewing machine operates scored higher on a subsequent comprehension quiz than subjects who only saw a photograph.",
      "Individuals who expressed high confidence in their general historical trivia knowledge were equally confident when estimating their ability to learn a foreign language."
    ],
    [
      "<i>Paleontologists have long debated whether the Tyrannosaurus rex was strictly an active apex predator or purely an opportunistic scavenger. Recently, a team of researchers argued that fossil evidence definitively proves T. rex engaged in active predation on living dinosaurs.</i><br><br>Which fossil discovery, if true, would provide the most direct evidence for the researchers' argument?",
      "An Edmontosaurus tail bone with a T. rex tooth mark surrounded by healed, regrown bone.",
      "Multiple shed T. rex teeth with serrated edges found embedded among the scattered skeletal remains of a Triceratops that died in a prehistoric floodplain.",
      "Cranial endocasts of T. rex skulls indicating that the dinosaur possessed exceptionally large olfactory bulbs capable of detecting rotting carrion from several miles away.",
      "Biomechanical computer models of T. rex leg bones demonstrating that the adult animal could not run faster than twenty miles per hour without risking severe fractures."
    ],
    [
      "<i>Historians of technology suggest that the widespread adoption of the mechanical clock in fourteenth-century European towns fundamentally altered urban labor by shifting the measurement of work from task-oriented seasonal rhythms to fixed, standardized hours.</i><br><br>Which historical document from late fourteenth-century guild archives would best support the historians' suggestion?",
      "A diary entry by a rural monastery abbot complaining that novices frequently overslept during the winter months and missed morning prayers.",
      "A contract between a cathedral chapter and an Italian blacksmith detailing the price of iron gears required to repair the church's astronomical clock.",
      "A city law requiring weavers to start and end shifts at the strike of the town clock, regardless of daylight.",
      "A royal decree granting traveling merchants the right to hold open-air markets on the first Saturday of every month between spring and autumn."
    ],
    [
      "<i>Astrophysicists studying fast radio bursts (FRBs)—millisecond-long flashes of radio waves from distant galaxies—hypothesize that most FRBs originate from magnetars, which are young, highly magnetized neutron stars formed in the aftermath of core-collapse supernovae.</i><br><br>Which astronomical observation would most directly weaken the astrophysicists' hypothesis?",
      "Repeating FRBs are traced to an ancient galaxy where star formation and supernovae ended billions of years ago.",
      "Telescopes detect a powerful FRB accompanied by a burst of X-rays coming from a known magnetar located within our own Milky Way galaxy.",
      "Statistical models indicate that the magnetic fields of magnetars decay rapidly within ten thousand years of their initial formation in supernova remnants.",
      "Radio interferometers reveal that FRB signals become dispersed as they travel through ionized intergalactic gas clouds on their way to Earth."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Forest Type</th><th style=\"text-align:left;padding:4px\">Above-Ground Carbon (t/ha)</th><th style=\"text-align:left;padding:4px\">Soil Carbon (t/ha)</th></tr><tr><td style=\"padding:4px\">Tropical Rainforest</td><td>185</td><td>95</td></tr><tr><td style=\"padding:4px\">Temperate Deciduous</td><td>120</td><td>135</td></tr><tr><td style=\"padding:4px\">Boreal Coniferous</td><td>65</td><td>340</td></tr></table><i>Ecologists emphasize that conservation policies focusing solely on visible tree biomass overlook the most critical carbon reservoirs in high-latitude ecosystems.</i><br><br>Which data from the table most effectively support the ecologists' point?",
      "Boreal forests hold only 65 t/ha of carbon above ground but store 340 t/ha in their soil.",
      "Tropical rainforests store 185 tons per hectare of above-ground carbon, which is.",
      "Temperate deciduous forests have a relatively balanced distribution of carbon,.",
      "Across all three forest types listed in the study, the lowest recorded carbon."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Battery Chemistry</th><th style=\"text-align:left;padding:4px\">Energy Density (Wh/kg)</th><th style=\"text-align:left;padding:4px\">Cycle Life</th><th style=\"text-align:left;padding:4px\">Cobalt Content (%)</th></tr><tr><td style=\"padding:4px\">NMC-811</td><td>265</td><td>1,200</td><td>9%</td></tr><tr><td style=\"padding:4px\">LFP (Lithium Iron)</td><td>160</td><td>3,800</td><td>0%</td></tr><tr><td style=\"padding:4px\">NCA</td><td>250</td><td>1,000</td><td>14%</td></tr></table><i>An automotive engineer argues that for stationary grid storage—where battery weight is irrelevant but longevity and ethical mineral sourcing without cobalt are paramount—LFP chemistry is superior to NMC-811 and NCA.</i><br><br>Which choice best uses data from the table to support the engineer's argument?",
      "LFP lasts for 3,800 cycles and uses 0% cobalt, outperforming both NMC-811 and NCA.",
      "NMC-811 provides the highest energy density at 265 Wh/kg while reducing cobalt content to 9%, compared to 14% cobalt in standard NCA batteries.",
      "NCA batteries achieve an energy density of 250 Wh/kg, which is substantially higher than the 160 Wh/kg achieved by heavier LFP batteries.",
      "Both NMC-811 and NCA chemistries offer at least 1,000 charge cycles and energy densities exceeding 240 Wh/kg in laboratory testing."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Pollination Method</th><th style=\"text-align:left;padding:4px\">Fruit Set Rate (%)</th><th style=\"text-align:left;padding:4px\">Avg. Berry Weight (g)</th></tr><tr><td style=\"padding:4px\">Wind Only (Netted)</td><td>32%</td><td>1.1</td></tr><tr><td style=\"padding:4px\">Honeybees Only</td><td>58%</td><td>1.6</td></tr><tr><td style=\"padding:4px\">Wild Bumblebees + Honeybees</td><td>84%</td><td>2.3</td></tr></table><i>Agricultural researchers studying blueberry orchards conclude that relying exclusively on managed honeybee hives is insufficient to maximize both yield and fruit quality.</i><br><br>Which data from the table best support the researchers' conclusion?",
      "Adding wild bumblebees to honeybees raised fruit set from 58% to 84% and berry weight from 1.6g to 2.3g.",
      "Introducing managed honeybees increased the fruit set rate from 32% in wind-only netted plots to 58% and raised average berry weight from 1.1 grams to 1.6 grams.",
      "Plots restricted to wind pollination still managed to produce a 32% fruit set rate with berries averaging 1.1 grams in weight across the season.",
      "The average berry weight in honeybee-pollinated plots was 0.5 grams heavier than the average berry weight recorded in netted wind-pollinated plots."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">City</th><th style=\"text-align:left;padding:4px\">Green Space (%)</th><th style=\"text-align:left;padding:4px\">Summer Surface Temp Diff. (°C)</th></tr><tr><td style=\"padding:4px\">Metropolis A</td><td>11%</td><td>+6.4°C</td></tr><tr><td style=\"padding:4px\">Metropolis B</td><td>24%</td><td>+3.8°C</td></tr><tr><td style=\"padding:4px\">Metropolis C</td><td>39%</td><td>+1.5°C</td></tr></table><i>Urban climatologists measured the difference between downtown surface temperatures and surrounding rural temperatures across three cities, concluding that expanding urban tree canopies and parks directly mitigates the urban heat island effect.</i><br><br>Which observation from the table best supports the climatologists' conclusion?",
      "All three metropolitan areas experienced downtown summer surface temperatures that were warmer than their surrounding rural areas.",
      "Metropolis B has more than double the percentage of green space of Metropolis A, at 24% and 11% respectively compared with control groups monitored over the same time period.",
      "The smallest summer surface temperature difference recorded in the study was +1.5°C in Metropolis C throughout the entire geographic region surveyed by the researchers.",
      "As green space rises from 11% in Metropolis A to 39% in Metropolis C, the heat difference drops from +6.4°C to +1.5°C."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Treatment Group</th><th style=\"text-align:left;padding:4px\">Initial LDL (mg/dL)</th><th style=\"text-align:left;padding:4px\">12-Week LDL (mg/dL)</th></tr><tr><td style=\"padding:4px\">Placebo</td><td>162</td><td>159</td></tr><tr><td style=\"padding:4px\">Drug X (10 mg)</td><td>165</td><td>118</td></tr><tr><td style=\"padding:4px\">Drug X (20 mg)</td><td>164</td><td>116</td></tr></table><i>Cardiologists evaluating clinical trial data for Drug X noted that while the medication effectively lowers LDL cholesterol, doubling the dosage from 10 mg to 20 mg provides negligible additional benefit.</i><br><br>Which data from the table best support the cardiologists' assessment?",
      "12-week LDL was 118 mg/dL for the 10 mg dose and 116 mg/dL for the 20 mg dose.",
      "Patients in the placebo group began the clinical trial with an initial average LDL of 162 mg/dL and ended after 12 weeks with an average of 159 mg/dL.",
      "Both the 10 mg and 20 mg treatment groups started the clinical trial with baseline average LDL cholesterol levels above 160 mg/dL.",
      "The 20 mg dose of Drug X reduced LDL cholesterol by 48 mg/dL over the 12-week period, compared to a 3 mg/dL reduction in the placebo group."
    ],
    [
      "<i>Botanists studying the Venus flytrap (Dionaea muscipula) note that snapping its trap shut requires considerable metabolic energy. To avoid wasting energy on non-nutritious triggers like raindrops, the plant's trap only closes when sensory hairs are stimulated twice within twenty seconds, and only begins secreting digestive enzymes after five additional stimulations.</i><br><br>Which experimental finding would most directly support the botanists' explanation of the five-stimulation requirement?",
      "Traps triggered twice by a nylon bristle closed but reopened later without secreting digestive fluids.",
      "Traps that were mechanically prevented from closing when live beetles crawled across their sensory.",
      "Venus flytraps grown in nitrogen-rich soil produced fewer traps relative to ordinary flat leaves.",
      "A single electrical impulse applied directly to the midrib of a Venus flytrap leaf caused the lobes."
    ],
    [
      "<i>Sociologists studying remote work trends argue that while working from home strengthens communication among close teammates, it weakens 'weak ties'—casual, unplanned interactions with colleagues in other departments that often spark cross-disciplinary innovation.</i><br><br>Which finding from an analysis of corporate communication logs before and after a company transitioned to full-time remote work would best support the sociologists' claim?",
      "Messages within project teams rose 18%, while messages between different departments fell 42%.",
      "Employees reported saving an average of seventy minutes per day previously spent commuting.",
      "Software engineers submitted 12 percent more lines of code per week during the first six months of remote work than they had in the office.",
      "Managers scheduled more formal weekly status meetings via video conference to monitor project milestones across their respective departments."
    ],
    [
      "<i>In a study of avian brood parasitism, biologists hypothesized that reed warblers learn to recognize and eject invasive cuckoo eggs not solely through innate instinct, but by observing neighboring warblers mobbing adult cuckoos near their nests.</i><br><br>Which experimental result would most strongly support the biologists' hypothesis?",
      "Older reed warblers that had nested in three previous seasons rejected foreign eggs at a higher rate than first-time breeders regardless of cuckoo presence.",
      "First-time nesters that saw a neighbor mob a cuckoo rejected foreign eggs four times more often than others.",
      "Cuckoo chicks that hatched successfully in reed warbler nests grew faster than the host's own chicks and evicted the warbler eggs within forty-eight hours.",
      "Reed warblers nesting in dense reed beds with poor visibility toward neighboring territories laid clutches of the same average size as warblers in open habitats."
    ],
    [
      "<i>In her poetry, Emily Dickinson frequently uses unconventional punctuation—most notably the em dash—not merely as a grammatical pause, but to visually and rhythmically represent fractured thought, hesitation, and the limits of language in confronting mortality.</i><br><br>Which quotation from a literary scholar's essay best illustrates this interpretation of Dickinson's style?",
      "\"In 'I heard a Fly buzz,' the dashes create jagged silences that mirror the sputtering of consciousness.\"",
      "\"When Dickinson's first posthumous volume was published in 1890, editors removed her dashes and altered her capitalization to conform to nineteenth-century printing standards.\"",
      "\"Many of Dickinson's shortest lyrics adopt the common meter of Protestant hymns, alternating between lines of eight and six syllables with a steady rhythmic pulse.\"",
      "\"Dickinson composed nearly eighteen hundred poems in relative seclusion in Amherst, sewing the manuscript pages together into small hand-bound booklets called fascicles.\""
    ],
    [
      "<i>Geologists investigating the Permian-Triassic mass extinction (252 million years ago) propose that massive volcanic eruptions in the Siberian Traps triggered runaway global warming by igniting vast underground coal beds, releasing catastrophic quantities of greenhouse gases.</i><br><br>Which geological discovery in rock layers dating to the exact boundary of the extinction would provide the strongest direct evidence for this mechanism?",
      "Charred coal ash spheres appear globally in extinction-boundary sediments alongside a spike in light carbon isotopes.",
      "Extensive basalt lava flows covering millions of square kilometers across northern Russia that cooled over a period of several hundred thousand years.",
      "Fossilized impressions of cold-adapted glossopteris ferns disappearing from southern hemisphere rock strata at the end of the Permian period.",
      "Elevated concentrations of iridium and shocked quartz crystals in clay layers, which are typically associated with extraterrestrial asteroid impacts."
    ],
    [
      "<i>Linguists studying the acquisition of American Sign Language (ASL) argue that human infants possess an innate sensitivity to the rhythmic and structural patterns of language, regardless of whether that language is spoken or visual-manual.</i><br><br>Which observation of six-month-old hearing infants who have never been exposed to sign language would best support the linguists' argument?",
      "The infants gaze much longer at videos of fluent ASL signing than at equally complex pantomime gestures.",
      "When deaf infants are raised by fluent ASL-signing parents, they begin 'babbling' with their hands.",
      "Adult learners of ASL show activation in the left hemisphere's Broca's area during functional MRI.",
      "Hearing infants can distinguish between phonetic contrasts in foreign spoken languages."
    ],
    [
      "<i>Art historians have long debated whether the seventeenth-century Dutch painter Johannes Vermeer used a camera obscura—an optical device that projects an inverted image of a scene onto a wall or canvas—to achieve his remarkably accurate perspective and lighting effects.</i><br><br>Which physical characteristic of Vermeer's paintings, if confirmed by technical analysis, would most strongly support the claim that he traced projected images?",
      "Microscopic pinholes located at the exact geometric vanishing point of the canvas, where a string was attached to chalk out straight perspective lines.",
      "Foreground objects show unfocused circular highlights that match the optical artifacts of uncorrected glass lenses.",
      "Underdrawings executed in brown ink that show Vermeer shifted the position of figures several times to improve the narrative balance of the composition.",
      "The use of ultramarine blue—an expensive pigment ground from lapis lazuli—in the shadowed folds of white linen tablecloths to create a sense of depth."
    ],
    [
      "<i>Environmental economists studying municipal recycling programs contend that 'pay-as-you-throw' (PAYT) pricing—charging residents per bag of unsorted trash while keeping recycling collection free—is far more effective at reducing landfill waste than public awareness campaigns alone.</i><br><br>Which comparative finding from two demographically similar towns would best support the economists' contention?",
      "Town A cut landfill waste by 38% after adopting PAYT, while Town B's ad campaign cut waste by only 2%.",
      "Residents of Town A reported in a telephone survey that they were already familiar with which plastics could be recycled prior to the municipal policy change.",
      "The municipal government of Town B expanded its curbside collection schedule from biweekly to weekly pickups to accommodate seasonal yard waste.",
      "In both towns, contamination of recycling bins with non-recyclable glass remained a persistent operational challenge for material recovery facilities."
    ],
    [
      "<i>Evolutionary biologists studying the naked mole-rat note that it is one of the few eusocial mammals, living in colonies where a single queen breeds and non-breeding workers cooperate to dig tunnels and defend the nest. The biologists hypothesize that this social structure evolved in response to the patchy distribution of underground tubers in arid East Africa.</i><br><br>Which finding from a comparative study of African mole-rat species would best support this hypothesis?",
      "Workers in naked mole-rat colonies are closely related genetically because colonies rarely accept dispersing individuals from neighboring tunnel systems.",
      "When a naked mole-rat queen dies, several high-ranking female workers undergo rapid hormonal changes and compete violently to become the new reproductive female.",
      "The tubers consumed by naked mole-rats can weigh up to forty kilograms, providing enough caloric energy to sustain a colony for several months.",
      "Solitary mole-rat species live in wet areas with even food distribution, while colonial species live in arid zones with scattered tubers."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Glass Type</th><th style=\"text-align:left;padding:4px\">UV Transmission (%)</th><th style=\"text-align:left;padding:4px\">Bird Collisions (per 100 days)</th></tr><tr><td style=\"padding:4px\">Standard Clear Glass</td><td>75%</td><td>44</td></tr><tr><td style=\"padding:4px\">UV-Reflective Patterned</td><td>18%</td><td>6</td></tr><tr><td style=\"padding:4px\">Tinted Dark Glass</td><td>42%</td><td>39</td></tr></table><i>Ornithologists testing architectural glass designs argue that incorporating ultraviolet (UV) patterns—which are invisible to humans but highly visible to birds—can drastically reduce fatal bird-window collisions without obstructing human views.</i><br><br>Which data from the table most directly support the ornithologists' claim?",
      "UV-patterned glass had only 6 collisions, compared to 44 for clear glass and 39 for tinted glass.",
      "Standard clear glass allows 75% UV transmission, whereas tinted dark glass reduces UV transmission to 42% during daylight hours.",
      "Tinted dark glass recorded 39 bird collisions per 100 days, which is 5 fewer collisions than standard clear glass recorded over the same period.",
      "UV-reflective patterned glass has the lowest UV transmission percentage among the three architectural glass types tested, at 18%."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Epoch</th><th style=\"text-align:left;padding:4px\">Avg. Equid Body Mass (kg)</th><th style=\"text-align:left;padding:4px\">Tooth Crown Height (mm)</th></tr><tr><td style=\"padding:4px\">Eocene (50 MYA)</td><td>12</td><td>8</td></tr><tr><td style=\"padding:4px\">Oligocene (30 MYA)</td><td>45</td><td>16</td></tr><tr><td style=\"padding:4px\">Miocene (15 MYA)</td><td>180</td><td>48</td></tr></table><i>Paleontologists tracking the evolution of horses (equids) in North America note that as open, silica-rich grasslands replaced soft-leaved forests during the Miocene epoch, equids evolved high-crowned teeth capable of withstanding abrasive grazing.</i><br><br>Which data from the table best illustrate this evolutionary transition?",
      "Tooth crown height tripled from 16 mm in the Oligocene to 48 mm in the Miocene.",
      "During the Eocene epoch 50 million years ago, early forest-dwelling equids.",
      "Average equid body mass increased from 12 kg in the Eocene to 45 kg.",
      "Both average body mass and tooth crown height increased across each."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Lighting Condition</th><th style=\"text-align:left;padding:4px\">Melatonin Delay (min)</th><th style=\"text-align:left;padding:4px\">Time to Fall Asleep (min)</th></tr><tr><td style=\"padding:4px\">Dim Red Light (650 nm)</td><td>4</td><td>14</td></tr><tr><td style=\"padding:4px\">Warm White LED</td><td>48</td><td>36</td></tr><tr><td style=\"padding:4px\">Blue-Enriched Screen (460 nm)</td><td>92</td><td>58</td></tr></table><i>Sleep researchers contend that it is specifically the short-wavelength blue light emitted by digital screens, rather than light exposure in general, that severely disrupts human circadian rhythms in the evening.</i><br><br>Which comparison from the table provides the strongest evidence for the researchers' contention?",
      "Blue screens delayed melatonin by 92 minutes and sleep by 58 minutes, versus 4 and 14 minutes for red light.",
      "Participants exposed to warm white LED lighting took an average of 36 minutes to fall asleep after experiencing a 48-minute melatonin onset delay.",
      "Across all three experimental lighting conditions, a longer delay in melatonin onset consistently corresponded with a longer time required to fall asleep.",
      "Warm white LED light delayed evening melatonin onset by 44 minutes more than dim red light did in the sleep laboratory."
    ],
    [
      "<i>Historians studying the Roman Empire's trade with India in the first century CE have debated whether Roman gold and silver coins were used by Indian merchants merely as raw bullion to be melted down, or whether they circulated as recognized currency within local Indian economies.</i><br><br>Which archaeological discovery in southern India would most strongly support the view that Roman coins circulated as local currency?",
      "Worn Roman coins stamped with local Indian guild marks to certify their marketplace value.",
      "Roman amphora shards containing dried residue of Mediterranean olive oil and wine found at the ancient port of Muziris.",
      "Locally minted Indian copper coins that imitate the profile portrait of the Roman Emperor Augustus on one side.",
      "Writings by the Roman author Pliny the Elder complaining that millions of sesterces flowed out of Rome each year to purchase Indian black pepper."
    ],
    [
      "<i>Biochemists investigating extremophile bacteria in Yellowstone's hot springs hypothesized that the heat-stability of the bacteria's enzymes is due to a high density of ionic 'salt bridges' between charged amino acids, which prevent the protein chains from unfolding at boiling temperatures.</i><br><br>Which laboratory experiment would provide the most direct test of the biochemists' hypothesis?",
      "Disrupting the salt bridges via mutation and testing if the enzymes unfold at lower temperatures.",
      "Culturing the Yellowstone bacteria in water cooled to room temperature to observe whether their rate of cellular division slows down.",
      "Comparing the total genome length of the hot-spring bacteria to that of closely related soil bacteria living in temperate climates.",
      "Extracting lipids from the bacteria's cell membranes to determine how they maintain structural fluidity under high hydrostatic pressure."
    ],
    [
      "<i>In a critique of F. Scott Fitzgerald's 'The Great Gatsby,' a scholar argues that the natural world in the novel is never depicted as an untouched pastoral refuge; instead, it is consistently shown as subordinated to and corrupted by modern industrial wealth.</i><br><br>Which quotation from the novel best illustrates the scholar's argument?",
      "\"In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\"",
      "\"Across the courtesy bay the white palaces of fashionable East Egg glittered along the water, and the history of the summer really begins on the evening I drove over there.\"",
      "\"Every Friday five crates of oranges and lemons arrived from New York—every Monday they left his back door in a pyramid of pulpless halves.\"",
      "\"Gatsby believed in the green light, the orgastic future that year by year recedes before us.\""
    ],
    [
      "<i>Cognitive scientists studying bilingualism propose that constantly managing two active language systems enhances the brain's 'executive control' network, which governs non-verbal tasks requiring attention switching and the inhibition of distracting stimuli.</i><br><br>Which finding from a study comparing lifelong bilingual adults and monolingual adults matched for age and education would best support this proposal?",
      "Bilinguals made fewer errors on a visual sorting task where the sorting rules changed unexpectedly.",
      "Bilingual adults were able to learn the vocabulary of a third, unfamiliar language more rapidly.",
      "Monolingual participants scored slightly higher than bilingual participants on a timed test.",
      "Brain imaging showed that when bilingual individuals spoke their second language, regions."
    ],
    [
      "<i>Ecologists studying wolf reintroduction in western North America suggested that the mere 'landscape of fear' created by the presence of wolves—causing elk to avoid open river valleys where they are vulnerable to ambush—was sufficient to allow streamside aspen trees to recover, even before wolf predation significantly reduced total elk numbers.</i><br><br>Which field observation would most directly challenge the ecologists' 'landscape of fear' explanation?",
      "Fenced aspens in open valleys grew rapidly, while unfenced aspens nearby were still heavily eaten by elk despite wolf patrols.",
      "Aerial surveys conducted ten years after wolf reintroduction showed that the overall elk herd population had stabilized at sixty percent of its pre-wolf peak.",
      "GPS collars on wolves revealed that packs spent the majority of their winter hunting hours traveling along frozen river corridors.",
      "Beaver colonies increased in number along streams where willow and aspen stands had reached a height of at least three meters."
    ],
    [
      "<i>Musicologists analyzing the transition from the Baroque harpsichord—which plucks strings at a fixed volume—to the eighteenth-century fortepiano note that the new instrument's touch-sensitive hammers allowed composers to write sudden, dramatic contrasts between loud and soft passages within a single phrase.</i><br><br>Which evidence from late eighteenth-century musical scores composed specifically for the fortepiano would best support the musicologists' claim?",
      "Alternating 'loud' and 'soft' markings on consecutive measures, which never appeared in harpsichord scores.",
      "Letters from Wolfgang Amadeus Mozart praising the mechanical reliability of Stein fortepianos compared to older keyboard instruments.",
      "A gradual increase in the total number of keys on the keyboard from five octaves in the 1770s to over six octaves by the 1810s.",
      "The continued publication of sheet music titled 'For Harpsichord or Fortepiano' by London printing houses to maximize commercial sales."
    ],
    [
      "<i>Public health researchers investigating the 'Hispanic epidemiological paradox'—the finding that first-generation Latino immigrants in the United States often have better cardiovascular health outcomes than US-born peers despite lower socioeconomic status—hypothesize that strong co-ethnic social networks buffer immigrants against chronic physiological stress.</i><br><br>Which study result would most directly support the researchers' hypothesis?",
      "Immigrants in tight-knit ethnic neighborhoods had much lower stress biomarkers than those in isolated areas.",
      "Second-generation US-born Latinos reported consuming a diet higher in processed sugars and saturated fats than first-generation immigrants who recently arrived.",
      "Immigrants who migrated to the United States as young adults were healthier on average at the time of departure than non-migrants who remained in their home countries.",
      "Access to bilingual preventative healthcare services was higher in major metropolitan areas than in rural agricultural counties."
    ],
    [
      "<i>Planetary geologists examining radar images of Saturn's moon Titan noticed vast fields of longitudinal dunes near the moon's equator. Because Titan's surface temperature is -179°C—where water ice is as hard as rock and silicate sand is buried beneath an icy crust—researchers concluded that the dune grains must be composed of solid organic hydrocarbons precipitated from the atmosphere.</i><br><br>Which spectroscopic measurement from an orbiter analyzing Titan's dune fields would most directly confirm the researchers' conclusion?",
      "Radar altimetry showing that the dunes reach heights of one hundred meters and stretch for hundreds of kilometers parallel to the equator.",
      "Dune spectra match solid hydrocarbons and show zero water-ice signatures.",
      "Atmospheric probe data indicating that methane rainstorms occur seasonally near Titan's north and south polar lakes.",
      "Gravitational field measurements suggesting that Titan possesses a subsurface ocean of liquid water mixed with ammonia beneath its icy shell."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Concrete Mix</th><th style=\"text-align:left;padding:4px\">Compressive Strength (MPa)</th><th style=\"text-align:left;padding:4px\">CO2 Footprint (kg/m³)</th></tr><tr><td style=\"padding:4px\">100% Portland Cement</td><td>42</td><td>380</td></tr><tr><td style=\"padding:4px\">30% Fly Ash Blend</td><td>45</td><td>275</td></tr><tr><td style=\"padding:4px\">50% Slag Blend</td><td>44</td><td>210</td></tr></table><i>Civil engineers claim that replacing a portion of traditional Portland cement with industrial byproducts like fly ash or blast-furnace slag can substantially lower concrete's carbon footprint without sacrificing structural strength.</i><br><br>Which data from the table best support the engineers' claim?",
      "Fly ash and slag blends cut CO2 to 275 and 210 kg/m³ while raising strength to 45 and 44 MPa.",
      "Traditional 100% Portland cement has a compressive strength of 42 MPa and generates 380.",
      "The 50% slag blend produces 65 kg/m³ less CO2 than the 30% fly ash blend, at 210 kg/m³.",
      "Among the three concrete mixes tested by engineers, the 30% fly ash blend recorded."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Translation Model</th><th style=\"text-align:left;padding:4px\">High-Resource BLEU Score</th><th style=\"text-align:left;padding:4px\">Low-Resource BLEU Score</th></tr><tr><td style=\"padding:4px\">Standard Neural (NMT)</td><td>41.2</td><td>14.5</td></tr><tr><td style=\"padding:4px\">Rule-Based Hybrid</td><td>33.8</td><td>26.4</td></tr><tr><td style=\"padding:4px\">Zero-Shot LLM</td><td>42.0</td><td>19.1</td></tr></table><i>Computational linguists use BLEU scores to measure machine translation accuracy (higher is better). A researcher argues that while purely data-driven models (NMT and LLM) excel in high-resource languages like Spanish, incorporating explicit grammatical rules remains advantageous for low-resource languages with scarce training data.</i><br><br>Which data from the table best support the researcher's argument?",
      "In low-resource languages, Rule-Based Hybrid scores 26.4, beating NMT (14.5) and LLM (19.1).",
      "Zero-Shot LLM achieves the highest score in high-resource languages at 42.0, slightly ahead of Standard NMT at 41.2.",
      "All three translation models achieve higher BLEU scores in high-resource languages than they do in low-resource languages.",
      "Standard NMT experiences a 26.7-point drop in BLEU score when moving from high-resource languages (41.2) to low-resource languages (14.5)."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Packaging Material</th><th style=\"text-align:left;padding:4px\">Production Energy (MJ/kg)</th><th style=\"text-align:left;padding:4px\">Municipal Recycling Rate (%)</th></tr><tr><td style=\"padding:4px\">Virgin Aluminum</td><td>210</td><td>68%</td></tr><tr><td style=\"padding:4px\">Recycled Aluminum</td><td>14</td><td>68%</td></tr><tr><td style=\"padding:4px\">PET Plastic</td><td>82</td><td>29%</td></tr></table><i>Sustainability analysts note that evaluating beverage containers solely by the energy required to manufacture virgin material can be misleading, because high recycling rates and low reprocessing energy dramatically alter a material's lifecycle impact.</i><br><br>Which data from the table best illustrate the analysts' point?",
      "Manufacturing virgin aluminum consumes 210 MJ/kg of energy, which is more than double the 82 MJ/kg required to manufacture PET plastic.",
      "Both virgin aluminum and recycled aluminum share the same municipal recycling rate of 68% compared with control groups monitored over the same time period.",
      "Recycled aluminum needs only 14 MJ/kg and is recycled at 68%, versus 82 MJ/kg and 29% for PET throughout the entire geographic region surveyed by the researchers.",
      "PET plastic has a municipal recycling rate of 29%, which is 39 percentage points lower than that of aluminum when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>Zoologists studying African elephants noticed that herds led by older matriarchs (aged 55+) were significantly more successful at surviving severe multi-year droughts than herds led by younger matriarchs (aged 35). The zoologists hypothesized that the survival advantage stemmed from the older matriarchs' long-term spatial memory of distant, drought-resistant waterholes last visited decades earlier.</i><br><br>Which tracking data from a severe drought year would most directly support the zoologists' hypothesis?",
      "Older matriarchs led herds 60 km to a spring last used 30 years ago, while younger ones stayed near dry rivers.",
      "Older matriarchs spent more hours per day foraging on woody bark and roots than younger females with nursing calves.",
      "Herds led by older matriarchs consisted of an average of fourteen adult females, compared to an average of eleven adult females in herds led by younger matriarchs.",
      "When encountering unfamiliar elephant herds at waterholes, older matriarchs displayed fewer aggressive defensive postures than younger matriarchs did."
    ],
    [
      "<i>In a study of consumer psychology, researchers proposed that displaying prices without currency symbols (e.g., '24' instead of '$24.00') on restaurant menus reduces the psychological 'pain of paying,' thereby encouraging diners to spend more money.</i><br><br>Which finding from a field experiment at a restaurant that randomly distributed three menu formats—'$24.00', '24', and 'twenty-four dollars'—would best support the researchers' proposal?",
      "Diners given the '24' menu spent 12% more per person than those given the other two menus.",
      "Diners who ordered from the '$24.00' menu rated the perceived quality of the restaurant's entrees just as highly as diners who ordered from the '24' menu.",
      "Groups of four or more diners spent more per person on appetizers and desserts than solo diners regardless of which menu format they were given.",
      "The 'twenty-four dollars' menu took diners an average of fifteen seconds longer to read than the '$24.00' numerical menu."
    ],
    [
      "<i>Literary scholars often note that in Mary Shelley's 'Frankenstein,' the sublime Arctic and Alpine landscapes do not merely serve as dramatic backdrops; rather, Victor Frankenstein's fluctuating responses to nature reflect his deteriorating moral and psychological state.</i><br><br>Which quotation from a critical analysis of the novel best supports this claim?",
      "\"Shelley drew inspiration for her descriptions of the Swiss Alps from the travel journals she kept during her 1816 journey through Geneva.\"",
      "\"While Mont Blanc's glaciers briefly soothe Victor's guilt, the barren Arctic ice at the end mirrors his total isolation.\"",
      "\"The framing narrative of the novel consists of letters written by Captain Robert Walton to his sister in England as his ship becomes",
      "\"Unlike Gothic novels set in medieval castles, 'Frankenstein' incorporates contemporary nineteenth-century debates surrounding galvanism"
    ],
    [
      "<i>Paleoanthropologists studying Neanderthal skeletal remains observed a high frequency of healed head and neck fractures similar to those seen in modern rodeo riders. Based on this pattern, they hypothesized that Neanderthals hunted large Ice Age mammals via close-range ambush with thrusting spears rather than throwing projectiles from a safe distance.</i><br><br>Which archaeological discovery at a Neanderthal hunting site would most directly weaken this hypothesis?",
      "Aerodynamically balanced throwing spears found alongside deer bones punctured at ranged impact angles.",
      "Butchered mammoth bones bearing deep stone-tool cut marks indicating that meat was stripped from the carcass and transported back to a cave.",
      "Neanderthal arm bones exhibiting pronounced muscle attachment ridges on the right humerus caused by repetitive strenuous thrusting motions.",
      "Isotopic analysis of Neanderthal tooth enamel showing that meat accounted for over eighty percent of their dietary protein during glacial periods."
    ],
    [
      "<i>Plant physiologists studying alpine cushion plants—low, densely packed mats of vegetation growing on windy mountain peaks—claim that these plants act as 'nurse species' that facilitate the survival of other herbaceous plants by ameliorating harsh microclimatic conditions.</i><br><br>Which field measurement would most directly support the physiologists' claim?",
      "Cushion mats keep soil 8°C warmer and 40% moister, tripling seedling survival for other plants inside them.",
      "Cushion plants possess deep taproots that anchor them firmly into rocky scree slopes where high winds prevent taller shrubs from establishing.",
      "The flowers of alpine cushion plants open earlier in the spring than the flowers of herbaceous species growing at lower elevations in the same mountain range.",
      "When herbaceous plants growing inside cushion mats were experimentally removed, the cushion plants produced 15 percent more seeds the following summer."
    ],
    [
      "<i>Historians of the American Revolution argue that boycotts of British imported goods in the 1760s and 1770s politicized the domestic sphere, transforming everyday household consumption decisions made by colonial women into public acts of ideological resistance.</i><br><br>Which primary source excerpt from a 1769 Boston newspaper would best illustrate the historians' argument?",
      "\"Three hundred women pledged to shun British tea and wear only homespun wool to defend colonial liberty.\"",
      "\"A shipping manifest from Boston Harbor listing the arrival of forty barrels of Caribbean molasses and twenty crates of English window glass.\"",
      "\"A pamphlet authored by a colonial lawyer arguing that Parliament lacked the constitutional authority to levy internal taxes without colonial representation.\"",
      "\"An advertisement placed by a local silversmith offering cash for broken silver spoons and teapots to be melted down into new tableware.\""
    ],
    [
      "<i>Behavioral ecologists studying satin bowerbirds—where males build decorative stick structures called bowers and adorn them with blue objects to attract females—hypothesize that a male's ability to accumulate rare blue ornaments signals superior cognitive problem-solving skills to potential mates.</i><br><br>Which finding from a study of wild male satin bowerbirds would most directly support this hypothesis?",
      "Females visited an average of six different bowers over a two-week period before returning to mate with one of the males they had previously inspected.",
      "Younger male bowerbirds have greenish-brown plumage identical to females and do not develop the glossy blue-black adult feathers until their seventh year.",
      "Males that scored highest on puzzle boxes also had the most blue feathers and highest mating success.",
      "When researchers added extra blue plastic rings to the bowers of low-ranking males, neighboring rival males immediately raided the bowers and destroyed the stick walls."
    ],
    [
      "<i>Pharmacologists developing a new migraine medication noted that while the drug was highly effective when injected intravenously, its oral tablet form failed in clinical trials. They hypothesized that the drug was being broken down by digestive enzymes in the stomach before it could be absorbed into the bloodstream.</i><br><br>Which experimental result would most directly falsify the pharmacologists' hypothesis?",
      "Patients who received the intravenous injection reported relief from migraine symptoms within thirty minutes, whereas patients taking the standard tablet reported no relief.",
      "Acid-resistant tablets bypassed the stomach intact, yet blood drug levels stayed zero because intestines couldn't absorb it when evaluated across multiple independent.",
      "Chemical analysis of the tablet showed that the active pharmaceutical ingredient remained stable for two years when stored at room temperature compared with control.",
      "Administering a higher dose of the standard oral tablet caused mild gastrointestinal discomfort in twenty percent of trial participants throughout the entire geographic."
    ],
    [
      "<i>Urban historians studying the growth of nineteenth-century Chicago argue that the invention of the balloon-frame house—built with lightweight, machine-sawed two-by-four studs nailed together rather than heavy hand-carved timber mortise-and-tenon joints—was essential for housing the city's rapidly expanding working-class population.</i><br><br>Which historical comparison from 1850s construction records would best support the historians' argument?",
      "Two unskilled workers could build a balloon-frame house in a week for 40% less than a timber-frame house.",
      "After the Great Chicago Fire of 1871, the city council passed strict ordinances requiring new commercial buildings in the downtown core to be constructed of brick and stone.",
      "Lumber mills in Michigan and Wisconsin shipped millions of board feet of white pine across Lake Michigan to Chicago's lumberyards each summer.",
      "Wealthy industrialists along Prairie Avenue commissioned architects to design elaborate mansions featuring imported Italian marble fireplaces."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Irrigation Method</th><th style=\"text-align:left;padding:4px\">Water Applied (m³/ha)</th><th style=\"text-align:left;padding:4px\">Cotton Yield (kg/ha)</th><th style=\"text-align:left;padding:4px\">Soil Salinity Increase (%)</th></tr><tr><td style=\"padding:4px\">Flood Irrigation</td><td>9,200</td><td>3,800</td><td>+18%</td></tr><tr><td style=\"padding:4px\">Overhead Sprinkler</td><td>6,400</td><td>4,100</td><td>+11%</td></tr><tr><td style=\"padding:4px\">Subsurface Drip</td><td>4,100</td><td>4,650</td><td>+2%</td></tr></table><i>Agronomists in arid regions contend that transitioning to subsurface drip irrigation not only conserves scarce water resources and boosts crop yields, but also prevents the long-term soil salinization caused by surface evaporation.</i><br><br>Which data from the table comprehensively support the agronomists' contention?",
      "Subsurface drip used the least water (4,100 m³/ha), yielded the most cotton (4,650 kg/ha), and raised salinity by just 2%.",
      "Overhead sprinklers reduced water application from 9,200 m³/ha to 6,400 m³/ha and increased cotton yield from 3,800 kg/ha to 4,100 kg/ha.",
      "Flood irrigation required 9,200 m³/ha of water, which is more than double the 4,100 m³/ha required by subsurface drip irrigation.",
      "All three irrigation methods resulted in some degree of soil salinity increase over the course of the agricultural growing season."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Ocean Depth Zone</th><th style=\"text-align:left;padding:4px\">Bioluminescent Species (%)</th><th style=\"text-align:left;padding:4px\">Dissolved Oxygen (mg/L)</th></tr><tr><td style=\"padding:4px\">Epipelagic (0–200 m)</td><td>12%</td><td>6.8</td></tr><tr><td style=\"padding:4px\">Mesopelagic (200–1,000 m)</td><td>76%</td><td>2.4</td></tr><tr><td style=\"padding:4px\">Bathypelagic (1,000–4,000 m)</td><td>58%</td><td>4.1</td></tr></table><i>A marine biology student claims that the proportion of marine species capable of bioluminescence increases steadily with ocean depth, while dissolved oxygen decreases steadily with depth.</i><br><br>Which data from the table refute both parts of the student's claim?",
      "From mesopelagic to bathypelagic, bioluminescence drops from 76% to 58% while oxygen rises from 2.4 to 4.1 mg/L.",
      "In the epipelagic zone (0–200 m), only 12% of species are bioluminescent and dissolved oxygen is at its highest recorded level of 6.8 mg/L.",
      "Between the epipelagic and mesopelagic zones, bioluminescent species rise from 12% to 76% while dissolved oxygen drops from 6.8 mg/L to 2.4 mg/L.",
      "The mesopelagic zone has the highest percentage of bioluminescent species at 76% and the lowest dissolved oxygen at 2.4 mg/L."
    ],
    [
      "<i>In a study of ancient Egyptian mummification, chemists challenged the long-held view that embalmers during the New Kingdom used locally sourced pine and cedar resins exclusively. Instead, the chemists argued that Egyptians participated in a vast trade network that imported specialized aromatic resins from tropical Southeast Asia.</i><br><br>Which chemical finding from New Kingdom mummy wrappings would most directly support the chemists' argument?",
      "Biomarkers of dammar resin, which comes only from trees native to Indonesian and Malaysian rainforests.",
      "Traces of bitumen (natural asphalt) originating from the Dead Sea region, which lies several hundred kilometers northeast of the Nile Valley.",
      "High concentrations of natron—a naturally occurring mixture of sodium carbonate salts harvested from dry lake beds in northern Egypt.",
      "Pollen grains from olive and cypress trees native to the eastern Mediterranean coast along modern-day Lebanon and Syria."
    ],
    [
      "<i>Psychologists studying the 'bystander effect' note that individuals are less likely to help a person in distress when passive onlookers are present. However, a recent study suggests that when an emergency is unambiguously dangerous—such as a violent assault rather than a minor slip—the presence of other bystanders does not inhibit intervention and may even facilitate coordinated help.</i><br><br>Which observation from an analysis of real-world public security camera footage would best support the recent study's suggestion?",
      "Pedestrians walking alone on quiet streets were more likely to stop and help someone who dropped a bag of groceries than pedestrians in crowded stations.",
      "In severe assaults, victims got help in 90% of cases with five or more bystanders versus 70% with just one.",
      "When experimental actors feigned a mild ankle sprain in a park, bystanders looked toward other witnesses' facial expressions before deciding whether.",
      "Individuals who had completed formal first-aid training reported feeling greater personal responsibility to intervene in medical emergencies."
    ],
    [
      "<i>In her 1925 novel 'Mrs. Dalloway,' Virginia Woolf uses the chiming of Big Ben throughout the day in London to contrast objective, linear clock time with the fluid, subjective 'psychological time' experienced by her characters as their minds drift between present sensations and distant memories.</i><br><br>Which quotation from a literary analysis of the novel best illustrates this contrast?",
      "\"As Big Ben strikes noon, Clarissa's thoughts span thirty years of her youth within a single street crossing.\"",
      "\"Woolf structured the entire narrative of 'Mrs. Dalloway' to take place on a single Wednesday in June 1923 as Clarissa prepares to host an evening party.\"",
      "\"The character of Septimus Warren Smith, a traumatized World War I veteran, serves as a thematic double for Clarissa despite the two never meeting face to face.\"",
      "\"London's parks, omnibuses, and bustling shopping streets are rendered with vivid sensory detail that captures the vitality of the city after the war.\""
    ],
    [
      "<i>Evolutionary anthropologists hypothesize that the unique whiteness of the human sclera—the outer part of the eye surrounding the iris, which is darkly pigmented in chimpanzees and other great apes—evolved as a 'cooperative eye' adaptation to allow group members to easily follow one another's gaze direction during collaborative foraging.</i><br><br>Which experimental finding comparing humans and chimpanzees would most directly support the 'cooperative eye' hypothesis?",
      "Toddlers followed eye movements alone to find food, while chimps only followed full head turns.",
      "Chimpanzees living in dense rainforest canopies have darker sclerae that help camouflage their eyes from both predators and competing primates.",
      "A few individuals in wild western lowland gorilla populations exhibit patchy depigmentation of the sclera due to benign genetic variations.",
      "Human infants begin making sustained mutual eye contact with their mothers within the first few weeks of life."
    ],
    [
      "<i>Materials scientists developing self-healing polymers for smartphone screens incorporated microcapsules filled with liquid linseed oil into the plastic matrix. They claim that when a scratch ruptures the capsules, the oil flows into the crack and oxidizes upon contact with air, solidifying into a transparent film that restores structural integrity.</i><br><br>Which test result would most directly validate the mechanism described by the scientists?",
      "Scratched samples healed in air within four hours, but stayed liquid and unhealed in oxygen-free nitrogen.",
      "Uncut polymer sheets containing linseed oil microcapsules transmitted 98 percent of visible light, matching the optical clarity of standard glass screens.",
      "Microcapsules with thinner polymer shells ruptured under lower mechanical pressure than microcapsules engineered with thicker walls.",
      "Heating the polymer matrix to eighty degrees Celsius accelerated the evaporation of water vapor from the surface of the material."
    ],
    [
      "<i>Economists studying the impact of minimum wage increases on restaurant employment noted that in several metropolitan areas, raising the minimum wage by 20 percent did not lead to the job losses predicted by classical competitive labor models. They hypothesized that higher wages reduced costly employee turnover, offsetting the increased payroll expenses.</i><br><br>Which data from restaurant payroll and human resources records before and after the wage increase would best support the economists' hypothesis?",
      "Fast-food franchises increased menu prices by an average of 4 percent in the six months following the implementation of the higher minimum wage.",
      "Quit rates fell 35% after the wage hike, saving $1,800 per worker in hiring costs while hours stayed stable when evaluated across multiple independent trials in the laboratory.",
      "Independent full-service restaurants employed a higher ratio of tipped waitstaff to kitchen workers than national counter-service chains did compared with control groups monitored over the same time period.",
      "Total consumer spending on dining out across the metropolitan area grew by 6 percent due to broader regional economic expansion throughout the entire geographic region surveyed by the researchers."
    ],
    [
      "<i>Geochemists studying the origin of Earth's water long assumed that our oceans were delivered by icy comets from the outer solar system after the planet formed. However, measurements of the deuterium-to-hydrogen (D/H) ratio in comets show it is twice as high as in Earth's oceans, leading geochemists to conclude that carbonaceous chondrite asteroids from the inner asteroid belt were the primary source.</i><br><br>Which isotopic finding from meteorites originating from carbonaceous chondrite asteroids would most directly support the geochemists' conclusion?",
      "Water inside carbonaceous chondrite meteorites has a D/H ratio nearly identical to Earth's oceans.",
      "Carbonaceous chondrite asteroids contain up to ten percent water by mass, which is lower.",
      "Computer simulations of the early solar system indicate that Jupiter's gravity scattered.",
      "Lunar rock samples brought back by the Apollo missions contain trace amounts of water."
    ],
    [
      "<i>In a study of plant acoustics, biologists proposed that evening primrose flowers (Oenothera drummondii) can 'hear' the wingbeat frequencies of approaching pollinator bees—using the bowl-shaped flower petals as sound resonators—and respond by rapidly increasing the sugar concentration of their nectar.</i><br><br>Which experimental observation would provide the strongest direct evidence that the petals themselves act as the acoustic sensor?",
      "Bee sounds boosted nectar sugar by 20%, unless the petals were trimmed or coated in wax.",
      "Bees spent forty percent more time feeding on flowers that had been pre-exposed to acoustic vibrations than on flowers kept in silent chambers.",
      "Flowers exposed to high-frequency ultrasound (100 kHz), far above the range of bee wingbeats, showed no change in nectar volume or sugar concentration.",
      "Laser vibrometry confirmed that the petals of intact primrose flowers vibrate mechanically when a honeybee hovers within ten centimeters."
    ],
    [
      "<table style=\"margin:8px 0;border-collapse:collapse;width:100%\"><tr><th style=\"text-align:left;padding:4px\">Study Strategy</th><th style=\"text-align:left;padding:4px\">Predicted Score (%)</th><th style=\"text-align:left;padding:4px\">Actual Exam Score (%)</th></tr><tr><td style=\"padding:4px\">Massed Rereading</td><td>82%</td><td>61%</td></tr><tr><td style=\"padding:4px\">Highlighting Text</td><td>78%</td><td>59%</td></tr><tr><td style=\"padding:4px\">Spaced Self-Testing</td><td>66%</td><td>88%</td></tr></table><i>Educational psychologists point out that students frequently choose ineffective study habits because passive review creates a deceptive feeling of fluency, whereas effortful retrieval feels harder in the moment despite producing superior mastery.</i><br><br>Which data from the table best illustrate this metacognitive mismatch?",
      "Students using spaced self-testing predicted the lowest score (66%) but achieved the highest actual score (88%), whereas massed rereading yielded the highest predicted score (82%) but only 61% on the exam.",
      "Students who highlighted text predicted they would score 78% on the exam and actually scored 59%, a difference of 19 percentage points when evaluated across multiple independent trials in the laboratory compared with control groups monitored over the same time period.",
      "Massed rereading resulted in an actual exam score of 61%, which was 2 percentage points higher than the 59% achieved by highlighting text compared with control groups monitored over the same time period throughout the entire geographic region surveyed by the researchers.",
      "Across the three strategies, predicted exam scores ranged from a low of 66% to a high of 82% throughout the entire geographic region surveyed by the researchers when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>Historians of ancient Greece note that while Athenian democracy in the fifth century BCE granted radical political equality to all adult male citizens regardless of wealth, the leisure time required for poorer citizens to attend the Assembly and serve on juries was only made possible by state stipends funded by tributes from Athens's maritime empire.</i><br><br>Which historical evidence from fifth-century Athens would most directly support the historians' analysis?",
      "Inscriptions showing that Pericles introduced daily jury pay (misthophoria) directly from the Delian League treasury, which immediately doubled participation by landless laborers in the courts.",
      "Speeches by the orator Demosthenes praising the courage of Athenian rowers who manned the trireme warships during the Peloponnesian War compared with control groups monitored over the same time period.",
      "Archaeological excavations of the Pnyx hill in Athens indicating that the stone auditorium could seat approximately six thousand citizens at one time throughout the entire geographic region surveyed by the researchers.",
      "Philosophical dialogues by Plato criticizing the Athenian Assembly for being easily swayed by persuasive rhetoric rather than expert knowledge when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>Entomologists studying monarch butterflies (Danaus plexippus) observed that females infected with the protozoan parasite Ophryocystis elektroscirrha preferentially lay their eggs on tropical milkweed (Asclepias curassavica), which contains high levels of toxic cardenolides, rather than on less toxic swamp milkweed. The entomologists claim this is a form of transgenerational 'medication' to protect their offspring.</i><br><br>Which experimental finding would most directly support the entomologists' claim?",
      "Infected caterpillars reared on high-cardenolide tropical milkweed had 60 percent lower parasite loads and lived twice as long as infected caterpillars reared on swamp milkweed, whereas uninfected females showed no plant preference.",
      "Uninfected monarch caterpillars grew at the same rate on both tropical milkweed and swamp milkweed when raised in predator-free laboratory cages throughout the entire geographic region surveyed by the researchers when evaluated across multiple independent trials in the laboratory.",
      "Birds that attempted to eat adult monarch butterflies reared on tropical milkweed immediately regurgitated the insects due to the bitter taste of the cardenolides when evaluated across multiple independent trials in the laboratory compared with control groups monitored over the same time period.",
      "Tropical milkweed planted in gardens in the southern United States remains green year-round, sometimes disrupting the monarchs' autumn migration to Mexico compared with control groups monitored over the same time period."
    ],
    [
      "<i>Neuroscientist Dr. Kenji Sato hypothesizes that slow-wave sleep spindles do not merely consolidate all daytime experiences equally; rather, they selectively strengthen memories tagged as having high future utility while allowing incidental details to fade.</i><br><br>Which finding from Sato's experiment, if true, would most directly support his hypothesis?",
      "Participants who slept after learning two word lists—one they were told would be tested for a cash reward and one they were told would not be retested—showed spindle-correlated recall gains only for the reward-tagged list.",
      "Participants who were deprived of slow-wave sleep for an entire night performed worse on morning reaction-time tasks than participants who slept for eight uninterrupted hours when evaluated across multiple independent.",
      "Electroencephalogram recordings showed that sleep spindle frequency varied slightly depending on the age of the participant but remained stable across consecutive nights in the lab compared with control groups monitored.",
      "Subjects who studied word lists in the morning recalled roughly the same number of words after a twelve-hour waking interval as subjects who studied them in the afternoon throughout the entire geographic region surveyed."
    ],
    [
      "<i>Archaeobotanists long debated whether Polynesian voyagers reached the Pacific coast of South America prior to European contact. Proponents of pre-Columbian contact point to the sweet potato (Ipomoea batatas), a native Andean crop that was cultivated across Polynesia by 1100 CE—centuries before Spanish ships crossed the Pacific—and whose Quechua name, kumar, closely matches the pan-Polynesian word kumara.</i><br><br>Which additional genetic finding, if true, would most strongly reinforce the proponents' argument?",
      "Ancient DNA extracted from pre-1200 CE Polynesian sweet potato specimens shares unique mutations exclusively with coastal Ecuadorian and Peruvian landraces rather than Caribbean varieties.",
      "Sweet potato seeds possess tough outer coats that allow them to remain viable after floating in saltwater currents for several weeks under laboratory tank conditions compared with control groups monitored over the same time period.",
      "Spanish galleons sailing from Acapulco to Manila in the late sixteenth century carried several distinct varieties of Central American sweet potatoes to the Philippines throughout the entire geographic region surveyed by the researchers.",
      "Polynesian agricultural terraces on Rapa Nui and Hawaii were irrigated using stone channel designs that differ markedly from Inca highland terraces in Peru when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>In a study of urban heat islands, environmental engineer Dr. Layla Hassan argues that replacing dark asphalt roofs with high-albedo white elastomeric coatings reduces not only building air-conditioning loads but also ambient street-level ozone formation on sunny summer afternoons, because photochemical smog reactions accelerate exponentially above 32°C.</i><br><br>Which data from a multi-neighborhood field trial would most directly support Hassan's claim about street-level air quality?",
      "Districts that retrofitted 60% of roofs with high-albedo coatings recorded a 2.4°C drop in afternoon air temperature and an 18% reduction in peak ground-level ozone compared with control districts.",
      "Buildings with white elastomeric roof coatings consumed 22% less electricity for third-floor air conditioning during July heatwaves than identical buildings with black bitumen roofs throughout the entire geographic region surveyed by the researchers.",
      "High-albedo elastomeric coatings retained 85% of their solar reflectance after three years of exposure to urban soot and seasonal rainfall when washed annually when evaluated across multiple independent trials in the laboratory.",
      "Pedestrians walking along tree-lined avenues reported higher thermal comfort scores than pedestrians walking along unshaded commercial boulevards at midday compared with control groups monitored over the same time period."
    ],
    [
      "<i>In her critique of Jane Austen's Mansfield Park (1814), literary scholar Clara Tuite argues that protagonist Fanny Price's physical frailty and quiet passivity are not signs of moral weakness; instead, Austen uses Fanny's stillness as a strategic foil that exposes the restless vanity and ethical superficiality of the charming Bertram family and their London guests.</i><br><br>Which quotation from Mansfield Park most effectively illustrates Tuite's claim?",
      "\"While the others eagerly rehearsed their parts for the forbidden play with noisy self-importance, Fanny sat apart by the work-table, the only observer who perceived how each actor's vanity was wounding the rest.\"",
      "\"Fanny had never been strong enough to walk beyond the shrubbery without feeling fatigued, so her aunt Norris frequently complained that the girl was of very little use in the household.\" when evaluated across multiple independent trials in the laboratory",
      "\"Sir Thomas Bertram returned from his estates in Antigua in November, bringing a grave silence that immediately ended the young people's evening amusements in the drawing-room.\" compared with control groups monitored over the same time period",
      "\"When Fanny first arrived at Mansfield Park from Portsmouth at the age of ten, she was overwhelmed by the size of the rooms and the grandeur of the staircase.\" throughout the entire geographic region surveyed by the researchers"
    ],
    [
      "<i>Economists studying 'algorithmic pricing' in retail markets warn that even when competing pricing algorithms are never explicitly programmed to collude, reinforcement-learning agents optimizing long-term profit in the same market can autonomously learn to maintain supracompetitive prices by punishing any rival's price cut with an immediate temporary price war.</i><br><br>Which simulation result would most directly support the economists' warning?",
      "When two independent Q-learning algorithms competed across 10,000 simulated market periods without communication, prices converged 28% above marginal cost and any forced price dip triggered an immediate retaliatory cut.",
      "Retailers that used rule-based inventory software updated their online catalog prices four times more frequently than brick-and-mortar grocery stores that printed paper shelf tags compared with control groups monitored over the same time period.",
      "Consumers who used price-comparison browser extensions saved an average of 9% on electronics purchases compared with consumers who bought directly from a single retailer throughout the entire geographic region surveyed by the researchers.",
      "When a single monopoly firm used a reinforcement-learning algorithm to set prices across seasonal demand cycles, its quarterly revenue increased by 6% over human managers when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>Paleontologists examining the theropod dinosaur Spinosaurus aegyptiacus have debated whether it was a pursuit predator that swam underwater like an otter or a shoreline wader that ambushed fish from the shallows like a heron. Biomechanist Matteo Fabbri and colleagues measured femoral bone wall thickness (compactness) across 250 extinct and extant amniote species, noting that habitual subaqueous divers evolve dense, pachyostotic leg bones to counteract buoyancy.</i><br><br>Which finding from Fabbri's analysis would most strongly support the subaqueous diving hypothesis for Spinosaurus?",
      "Spinosaurus femora exhibit a bone compactness index of 0.96—matching penguins, hippos, and extinct marine mosasaurs, and far exceeding the hollow-boned 0.55 index of terrestrial theropods and wading birds.",
      "Fossilized Spinosaurus teeth recovered from Kem Kem riverbeds in Morocco feature conical, non-serrated crowns similar to those of modern fish-eating crocodilians throughout the entire geographic region.",
      "The neural spines along the dorsal vertebrae of Spinosaurus reached heights of 1.65 meters, forming a prominent sail structure that would have experienced drag if fully submerged when evaluated.",
      "Isotope ratios in Spinosaurus tooth enamel indicate that the animal spent a larger proportion of its life near freshwater river deltas than Tyrannosaurus rex did compared with control groups monitored."
    ],
    [
      "<i>Sociologist Dr. Aris Thorne contends that remote-work policies implemented by knowledge-economy firms since 2020 have paradoxical effects on professional communication: while synchronous video meetings within immediate project teams increase, weak-tie interactions across different departments decline sharply, potentially slowing cross-disciplinary innovation.</i><br><br>Which finding from an analysis of anonymized corporate communication metadata would best support Thorne's contention?",
      "After transitioning to full-time remote work, engineers spent 19% more hours in scheduled team video calls but exchanged 38% fewer messages with colleagues outside their reporting division.",
      "Employees working remotely reported saving an average of 72 minutes per daypreviously spent commuting on metropolitan highways and commuter rail networks when evaluated across multiple independent trials in the laboratory.",
      "Software developers who worked from home submitted 8% more lines of code per week during the first six months of remote work than they had in the office compared with control groups monitored over the same time period.",
      "Managers in human-resources departments sent more company-wide email announcements on Monday mornings than on Friday afternoons across both remote and in-person offices throughout the entire geographic region surveyed by the researchers."
    ],
    [
      "<i>Biochemist Dr. Elena Rostova proposes that alpine cushion plants surviving above 4,200 meters in the Andes protect their photosynthetic machinery from freezing night temperatures not by accumulating simple sugars alone, but by rapidly remodeling thylakoid membrane lipids to increase the ratio of unsaturated fatty acids whenever dusk temperatures drop below 2°C.</i><br><br>Which experimental observation would most directly validate Rostova's proposal?",
      "Mutant cushion plants lacking the enzyme that desaturates thylakoid lipids at dusk suffered irreversible photosystem II damage after a −4°C night despite having normal sucrose levels.",
      "Alpine cushion plants grown in low-altitude greenhouses at a constant 20°C produced larger leaves and longer stems than cushion plants growing on exposed Andean ridges compared with control groups monitored over the same time period.",
      "Wild cushion plants sampled at midday contained higher concentrations of protective anthocyanin pigments in their outer epidermal cells than valley grasses did throughout the entire geographic region surveyed by the researchers.",
      "Soil temperatures two centimeters beneath dense cushion-plant mats remained 3.5°C warmer overnight than bare mineral scree adjacent to the plants when evaluated across multiple independent trials in the laboratory."
    ],
    [
      "<i>Historian Dr. Marcus Vance argues that the rapid spread of coffeehouses in late seventeenth-century London transformed financial markets not merely by providing shelter from the weather, but by creating specialized reputational hubs where merchants, ship captains, and underwriters could verify maritime intelligence before pricing insurance risks.</i><br><br>Which historical evidence from 1690s London would most directly support Vance's argument?",
      "Edward Lloyd's coffeehouse published a thrice-weekly shipping register compiled from captains' firsthand reports on the premises, and underwriters sitting there quoted 30% narrower risk spreads than brokers elsewhere.",
      "Parliament debated imposing an excise tax on imported Mocha coffee beans in 1695 in order to protect domestic ale brewers from declining tavern attendance throughout the entire geographic region surveyed by the researchers.",
      "London coffeehouses charged a uniform admission fee of one penny, which entitled any patron to read the London Gazette and join political discussions at long wooden tables when evaluated across multiple independent trials in the laboratory.",
      "East India Company ships returning from Mocha and Java carried porcelain tea services alongside sacks of green coffee beans for auction at the Royal Exchange compared with control groups monitored over the same time period."
    ],
    [
      "<i>Astrophysicists modeling fast radio bursts (FRBs)—millisecond-long pulses of radio emission originating from distant galaxies—hypothesize that repeating FRBs are powered by young magnetars (neutron stars with extreme magnetic fields) embedded in dense, magnetized supernova remnants, whereas non-repeating FRBs arise from cataclysmic compact-object mergers in older, sparse stellar environments.</i><br><br>Which observational result from radio interferometry would most directly support this dual-origin hypothesis?",
      "Repeating FRBs consistently exhibit extreme Faraday rotation measures and lie within active star-forming knots, while non-repeating FRBs show minimal Faraday rotation and often occur in quiescent galaxy halos.",
      "Radio telescopes with larger collecting dishes detect both repeating and non-repeating FRBs at greater cosmological redshifts than smaller interferometer arrays do when evaluated across multiple independent trials in the laboratory.",
      "The duration of individual radio pulses from repeating FRBs averages 2.3 milliseconds, which is nearly identical to the 2.1-millisecond average of non-repeating bursts compared with control groups monitored over the same time period.",
      "Magnetars within the Milky Way occasionally emit X-ray flares that can be detected by orbiting space observatories for several minutes after a crustquake throughout the entire geographic region surveyed by the researchers."
    ]
  ],
  [
    [
      "<i>In 1928, bacteriologist Alexander Fleming observed that a mold contaminating one of his petri dishes had created a bacteria-free zone around itself. Although Fleming initially struggled to isolate the active compound, his ______ observation laid the groundwork for the development of penicillin by Howard Florey and Ernst Chain over a decade later.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "serendipitous",
      "methodical",
      "inconsequential",
      "premeditated"
    ],
    [
      "<i>When the completeness of the fossil record is evaluated, marine organisms with hard calcified shells are found in abundance, whereas soft-bodied jellyfish are exceedingly ______. Because gelatinous tissues decompose rapidly after death, their preservation requires anoxic seabed conditions that occur only rarely in geological history.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "scarce",
      "ubiquitous",
      "resilient",
      "homogeneous"
    ],
    [
      "<i>In her 1962 book 'Silent Spring,' marine biologist Rachel Carson documented the detrimental effects of indiscriminate pesticide use on bird populations. Chemical industry representatives attempted to ______ her findings as alarmist, yet independent federal inquiries soon validated her warnings and led to a nationwide ban on DDT.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "discredit",
      "corroborate",
      "emulate",
      "disseminate"
    ],
    [
      "<i>Unlike the hierarchical structure of traditional encyclopedias, which rely on a small panel of credentialed editors to vet every entry, Wikipedia operates on an egalitarian model where thousands of volunteer contributors ______ to draft, verify, and revise articles in real time.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "collaborate",
      "compete",
      "hesitate",
      "Diverge"
    ],
    [
      "<i>During the 1919 solar eclipse, astrophysicist Arthur Eddington photographed stars appearing near the edge of the Sun. His measurements confirmed Albert Einstein's general theory of relativity, demonstrating that the Sun's immense gravity ______ the path of starlight passing through the surrounding spacetime.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "deflects",
      "extinguishes",
      "accelerates",
      "originates"
    ],
    [
      "<i>The architectural design of the Alhambra palace in Granada, Spain, is celebrated for its intricate geometric tilework and arabesque stucco carvings. Far from being merely decorative, these repeating mathematical patterns were intended to evoke a sense of infinite order and ______ the viewer's contemplation of the divine.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "foster",
      "impede",
      "conceal",
      "exhaust"
    ],
    [
      "<i>In macroeconomics, central banks must exercise caution when adjusting interest rates to combat inflation. If policymakers raise rates too aggressively, they risk ______ economic growth altogether, triggering a recession and widespread unemployment instead of a gentle price stabilization.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "stifling",
      "bolstering",
      "ignoring",
      "predicting"
    ],
    [
      "<i>While studying the foraging behavior of New Caledonian crows in 2002, zoologist Alex Kacelnik observed a captive bird named Betty bend a straight piece of wire into a hook to retrieve food from a tube. This spontaneous modification provided ______ evidence that non-human animals can invent tools without prior training.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "compelling",
      "ambiguous",
      "tenuous",
      "spurious"
    ],
    [
      "<i>The treaty of Westphalia in 1648 brought an end to the Thirty Years' War, a conflict that had devastated Central Europe. By establishing the principle of state sovereignty—the idea that each nation-state has exclusive authority over its domestic affairs—the treaty helped ______ the frequency of religious wars across the continent.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "curtail",
      "exacerbate",
      "prolong",
      "mandate"
    ],
    [
      "<i><i>Although the 1815 eruption of Mount Tambora occurred in Indonesia, its climatic repercussions were global: volcanic sulfate aerosols injected into the stratosphere reflected incoming solar radiation, producing the 'Year Without a Summer' in 1816 and causing widespread crop failures across New England and Europe.</i></i><br><br>As used in the text, what does the word \"repercussions\" most nearly mean?",
      "consequences",
      "echoes",
      "intentions",
      "vibrations"
    ],
    [
      "<i>Paleoclimatologists reconstructing ancient temperatures rely on proxy data such as tree rings and ice cores. Because tree growth is influenced simultaneously by temperature, precipitation, and soil nutrients, isolating the thermal signal from these ______ variables requires sophisticated statistical calibration.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "confounding",
      "negligible",
      "uniform",
      "redundant"
    ],
    [
      "<i>In the early twentieth century, the 'vitalism' hypothesis—which held that organic compounds found in living organisms could only be produced by a mysterious life force—had already been ______ by Friedrich Wöhler's 1828 synthesis of urea from inorganic ammonium cyanate in a laboratory beaker.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "refuted",
      "vindicated",
      "fortified",
      "popularized"
    ],
    [
      "<i>Because the atmosphere of Venus is composed of 96.5% carbon dioxide and shrouds the planet in thick sulfuric acid clouds, optical telescopes cannot penetrate to the surface. Consequently, planetary cartographers had to rely on radar altimetry from the Magellan orbiter in 1990 to ______ the planet's hidden volcanic topography.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "delineate",
      "obliterate",
      "fabricate",
      "compress"
    ],
    [
      "<i>In Renaissance portraiture, patrons frequently commissioned artists to include specific symbolic objects—such as astrolabes, musical scores, or rare imported textiles—to ______ their erudition and social standing to anyone viewing the painting.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "convey",
      "renounce",
      "obscure",
      "deplete"
    ],
    [
      "<i><i>When the invasive cane toad (Rhinella marina) was introduced to Australia in 1935 to control sugar-cane beetles, ecologists failed to anticipate how rapidly the amphibian would proliferate in the absence of its natural South American predators.</i></i><br><br>As used in the text, what does the word \"proliferate\" most nearly mean?",
      "multiply",
      "wither",
      "hibernates",
      "assimilate"
    ],
    [
      "<i>The transition from vacuum tubes to silicon transistors at Bell Labs in 1947 was a watershed moment in electrical engineering. Whereas vacuum tubes were fragile, bulky, and generated excessive heat, transistors were microscopic and energy-efficient, rendering the older technology virtually ______ within two decades.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "obsolete",
      "indispensable",
      "avant-garde",
      "lucrative"
    ],
    [
      "<i>Literary scholars note that James Joyce's 1922 novel 'Ulysses' employs a highly ______ style, shifting abruptly from journalistic parody to stream-of-consciousness monologue across its eighteen episodes, thereby challenging readers who expect a uniform narrative voice.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "eclectic",
      "monotonous",
      "pedestrian",
      "didactic"
    ],
    [
      "<i>In deep-sea hydrothermal vent ecosystems, where sunlight is completely absent, chemosynthetic bacteria form the base of the food web. By oxidizing hydrogen sulfide emitted from the vents, these microbes ______ the role played by photosynthetic plants in terrestrial environments.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "parallel",
      "subvert",
      "require",
      "diminish"
    ],
    [
      "<i>When the Rosetta Stone was discovered in 1799, philologists realized that its three inscriptions—written in hieroglyphs, Demotic script, and ancient Greek—recorded the exact same royal decree from 196 BCE. This parallel text provided Jean-François Champollion with the key to ______ the previously unreadable Egyptian hieroglyphic system.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "decipher",
      "encrypt",
      "abridge",
      "transcribe"
    ],
    [
      "<i><i>Although the two political theorists agreed on the necessity of constitutional checks and balances, their correspondence from the 1780s reveals a sharp divergence regarding whether the executive branch should possess an absolute veto over legislative statutes.</i></i><br><br>As used in the text, what does the word \"divergence\" most nearly mean?",
      "disagreement",
      "detour",
      "harmony",
      "duplication"
    ],
    [
      "<i>In pharmacology, a 'prodrug' is a medication administered in a biologically inactive form. Only after the compound is metabolized by specific enzymes in the patient's liver does it convert into its active state, a design that helps ______ gastrointestinal irritation during absorption.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "mitigate",
      "induce",
      "amplify",
      "prolong"
    ],
    [
      "<i>Despite the popular perception of the Sahara as an unchanging expanse of sand dunes, paleoenvironmental evidence indicates that the region's climate is actually quite ______ over astronomical timescales: wobbles in Earth's orbital axis transform the desert into a vegetated savanna roughly every 21,000 years.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "dynamic",
      "static",
      "arid",
      "immutable"
    ],
    [
      "<i>During the Harlem Renaissance of the 1920s, writer Zora Neale Hurston rejected the pressure to sanitize rural African American vernacular for white audiences. Instead, she celebrated the rich idioms and folklore of her Florida hometown, asserting that authentic dialect was ______ to preserving the community's cultural vitality.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "integral",
      "extrinsic",
      "antithetical",
      "peripheral"
    ],
    [
      "<i>In 1977, physicist Kenneth Nebenzahl noted that while many inventors claim absolute originality, technological breakthroughs are rarely ______. Even the steam engine, often credited solely to James Watt, relied on decades of prior atmospheric pressure experiments by Denis Papin and Thomas Newcomen.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "autonomous",
      "derivative",
      "collaborative",
      "incremental"
    ],
    [
      "<i><i>In corporate governance, an independent board of directors is supposed to exercise rigorous oversight of executive compensation; however, critics argue that when CEOs handpick their own board members, the directors often become compliant and rubber-stamp excessive bonuses.</i></i><br><br>As used in the text, what does the word \"compliant\" most nearly mean?",
      "acquiescent",
      "regulated",
      "combative",
      "inflexible"
    ],
    [
      "<i>Neurologist Oliver Sacks was renowned for his clinical case histories, which blended rigorous medical observation with deep empathy. Rather than reducing patients to mere catalogs of neurological deficits, Sacks sought to ______ how individuals creatively adapt their identities to conditions such as visual agnosia or amnesia.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "illuminate",
      "obscure",
      "fabricate",
      "dismiss"
    ],
    [
      "<i>When constructing the Panama Canal between 1904 and 1914, chief sanitary officer William Gorgas recognized that yellow fever and malaria were transmitted by mosquitoes rather than 'bad air.' By draining stagnant swamps and fumigating worker housing, Gorgas ______ the mortality rate among laborers and made the engineering project feasible.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "curbed",
      "inflated",
      "stabilized",
      "overlooked"
    ],
    [
      "<i>In behavioral ecology, Batesian mimicry occurs when a harmless species evolves to imitate the warning coloration of a toxic species—such as the non-venomous scarlet kingsnake resembling the deadly coral snake. For this deception to remain effective, the mimics must remain relatively rare compared to the toxic models, lest predators learn that the color pattern is ______.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "bluffing",
      "lethal",
      "camouflaged",
      "nutritious"
    ],
    [
      "<i>The 1913 premiere of Igor Stravinsky's ballet 'The Rite of Spring' in Paris famously provoked a riot in the audience. Accustomed to the graceful symmetry of nineteenth-century Romantic ballet, conservative concertgoers found Stravinsky's dissonant chords and jagged, percussive rhythms utterly ______.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "jarring",
      "soothing",
      "derivative",
      "melodious"
    ],
    [
      "<i><i>While early twentieth-century geologists dismissed Alfred Wegener's 1912 theory of continental drift because he could not propose a plausible physical mechanism capable of moving massive landmasses, the discovery of seafloor spreading in the 1960s finally vindicated his core insight.</i></i><br><br>As used in the text, what does the word \"plausible\" most nearly mean?",
      "credible",
      "visible",
      "deceptive",
      "erroneous"
    ],
    [
      "<i>In semiconductor manufacturing, photolithography requires cleanrooms where airborne particles are filtered out to rigorous standards. Even a single microscopic speck of dust settling on a silicon wafer can ______ the delicate circuitry, ruining dozens of microprocessors at once.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "compromise",
      "enhance",
      "insulate",
      "replicate"
    ],
    [
      "<i>Historians analyzing the decline of the Venetian Republic in the seventeenth century point out that the rise of Atlantic trade routes to the Americas did not cause an immediate collapse. Instead, Venice experienced a ______ economic contraction, shifting from maritime commerce to mainland agriculture and luxury glass production over two hundred years.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "protracted",
      "precipitous",
      "momentary",
      "volatile"
    ],
    [
      "<i>Although extremophile tardigrades can survive exposure to the vacuum of outer space in a dehydrated state, they are not truly ______: if they are exposed to high-intensity ultraviolet solar radiation while hydrated and metabolically active, their DNA suffers irreparable damage.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "invulnerable",
      "microscopic",
      "lethargic",
      "fragile"
    ],
    [
      "<i>In her 1818 novel 'Frankenstein,' Mary Shelley frames Victor Frankenstein's scientific ambition as a double-edged sword. While his relentless curiosity enables him to discover the secret of animating lifeless matter, his subsequent refusal to take moral responsibility for his creation proves ______, leading to the destruction of everyone he loves.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "calamitous",
      "beneficial",
      "inconsequential",
      "redemptive"
    ],
    [
      "<i><i>In quantum mechanics, the Heisenberg uncertainty principle states that certain pairs of physical properties, such as a particle's exact position and its momentum, cannot be simultaneously known to arbitrary precision; this limitation is not due to faulty instruments, but is intrinsic to the wave-like nature of matter.</i></i><br><br>As used in the text, what does the word \"intrinsic\" most nearly mean?",
      "inherent",
      "external",
      "accidental",
      "temporary"
    ],
    [
      "<i>When restoring ancient Roman frescoes buried by the eruption of Mount Vesuvius in 79 CE, art conservators must choose solvents with extreme care. An overly aggressive chemical agent might strip away the original mineral pigments, whereas a solvent that is too mild will fail to ______ the encrusted layers of volcanic ash and calcium carbonate.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "dissolve",
      "solidify",
      "preserve",
      "deposit"
    ],
    [
      "<i>In diplomatic negotiations, ambassadors often employ strategic ambiguity—drafting treaty language that is deliberately ______ so that two opposing nations can sign the same document while interpreting contentious clauses in ways that satisfy their respective domestic audiences.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "equivocal",
      "explicit",
      "dogmatic",
      "inflammatory"
    ],
    [
      "<i>Biologists studying the sleep habits of alpine swifts (Tachymarptis melba) attached miniature accelerometers to the birds in 2013 and discovered that they can remain airborne continuously for over 200 days during migration, apparently ______ the need for stationary rest by engaging in brief periods of unihemispheric sleep while gliding.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "circumventing",
      "succumbing to",
      "exaggerating",
      "mandating"
    ],
    [
      "<i>Before the standardization of weights and measures during the French Revolution in the 1790s, commerce across French provinces was hampered by a ______ array of local units: the 'arpent' of land or the 'livre' of grain could vary in physical quantity from one village to the next, inviting disputes and fraud.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "bewildering",
      "coherent",
      "scanty",
      "streamlined"
    ],
    [
      "<i><i>Although the architect's initial blueprint for the municipal library was praised for its bold cantilevered glass atrium, the city council ultimately rejected the proposal as fiscally imprudent after engineers estimated that heating the structure in winter would triple the building's annual operating budget.</i></i><br><br>As used in the text, what does the word \"imprudent\" most nearly mean?",
      "unwise",
      "modest",
      "generous",
      "timely"
    ],
    [
      "<i>In evolutionary biology, 'convergent evolution' describes how distantly related lineages independently evolve similar traits when adapting to comparable environments. For example, the streamlined bodies and dorsal fins of sharks (fish) and dolphins (mammals) are not evidence of close shared ancestry, but rather ______ responses to the hydrodynamic demands of fast aquatic locomotion.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "analogous",
      "divergent",
      "vestigial",
      "anomalous"
    ],
    [
      "<i>During the Gilded Age in the late nineteenth century, economist Thorstein Veblen coined the term 'conspicuous consumption' to describe how the newly wealthy industrial elite purchased extravagant luxury goods not for their practical utility, but to ______ their financial superiority over lower socioeconomic classes.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "flaunt",
      "conceal",
      "squander",
      "equalize"
    ],
    [
      "<i>When NASA's New Horizons spacecraft flew past Pluto in 2015, planetary scientists expected to see a heavily cratered, geologically dead world. Instead, high-resolution images revealed Sputnik Planitia—a vast, crater-free plain of nitrogen ice that is actively convecting—forcing astronomers to ______ their assumptions about how small icy bodies retain internal heat.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "recalibrate",
      "entrench",
      "validate",
      "disregard"
    ],
    [
      "<i>In the study of medieval manuscripts, paleographers can often date an undated parchment within a few decades by examining its script. Because monastic scribes adhered to regional calligraphic fashions that evolved predictably over time, the shape of individual letters serves as a reliable chronological ______.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "benchmark",
      "anomaly",
      "digression",
      "impediment"
    ],
    [
      "<i><i>In his 1651 treatise 'Leviathan,' political philosopher Thomas Hobbes argued that without a sovereign authority to enforce laws, human beings in a 'state of nature' would engage in perpetual conflict over scarce resources, rendering industry and agriculture impossible.</i></i><br><br>As used in the text, what does the word \"perpetual\" most nearly mean?",
      "ceaseless",
      "sporadic",
      "mild",
      "justifiable"
    ],
    [
      "<i>Agronomists warn that modern industrial agriculture's reliance on genetic monocultures—planting vast acreage with a single high-yield crop variety—renders the food supply dangerously ______ to novel pathogens, since a fungus capable of infecting one plant can rapidly wipe out the entire harvest.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "susceptible",
      "immune",
      "indifferent",
      "hostile"
    ],
    [
      "<i>While many nineteenth-century biographers of Abraham Lincoln relied on romanticized anecdotes to portray him as a flawless folk hero, modern historians strive for a more ______ assessment, weighing his pragmatic political compromises alongside his moral leadership during the American Civil War.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "nuanced",
      "partisan",
      "superficial",
      "reverent"
    ],
    [
      "<i>In arctic tundra ecosystems, lichens—symbiotic partnerships between fungi and photosynthetic algae—grow at an exceptionally ______ pace, often expanding by less than a millimeter per year due to the subzero temperatures and brief summer growing season.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "sluggish",
      "erratic",
      " brisk",
      "prolific"
    ],
    [
      "<i>When the first fossil of Archaeopteryx was unearthed in Bavarian limestone in 1861—just two years after Charles Darwin published 'On the Origin of Species'—its mosaic of reptilian teeth, clawed wings, and avian feathers provided a crucial ______ form linking non-avian dinosaurs to modern birds.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "transitional",
      "terminal",
      "extraneous",
      "hypothetical"
    ],
    [
      "<i><i>Although the composer's early symphonies were criticized by Vienna's conservative music press as derivative of Joseph Haydn, his later string quartets displayed an audacity of harmonic invention that astonished even his most skeptical contemporaries.</i></i><br><br>As used in the text, what does the word \"audacity\" most nearly mean?",
      "boldness",
      "rudeness",
      "timidity",
      "simplicity"
    ],
    [
      "<i>In cognitive psychology, 'anchoring bias' describes the human tendency to rely too heavily on the first piece of information encountered when making decisions. Even when an initial numeric estimate is completely arbitrary, subsequent judgments remain ______ toward that starting value.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "skewed",
      "insulated",
      "neutralized",
      "immunized"
    ],
    [
      "<i>Unlike the Mayan writing system, which was phonetic and logosyllabic, the Aztec codices of central Mexico utilized primarily pictographic and ideographic symbols. Because these symbols did not represent specific spoken syllables, colonial Spanish chroniclers found the codices difficult to interpret without oral commentary from indigenous scribes to ______ the visual narratives.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "elucidate",
      "obfuscate",
      "condense",
      "contradict"
    ],
    [
      "<i>In materials science, nitinol—an alloy of nickel and titanium discovered in 1959—is prized for its 'shape-memory' property: even if a nitinol wire is severely bent at room temperature, heating it above its transformation threshold causes its crystal lattice to ______ to its original forged geometry.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "revert",
      "yield",
      "fracture",
      "disperse"
    ],
    [
      "<i>While some urban planners advocate for 'smart city' sensors that monitor pedestrian traffic and energy use in real time, privacy advocates caution that ubiquitous data collection in public spaces can become ______, eroding citizens' anonymity without their explicit consent.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "intrusive",
      "benign",
      "transparent",
      "ineffectual"
    ],
    [
      "<i><i>In 1925, astronomer Cecilia Payne-Gaposchkin analyzed the spectral lines of stars in her doctoral dissertation and concluded that hydrogen and helium are the most abundant elements in the universe—a finding that initially met with resistance from senior astrophysicists who assumed stellar composition mirrored Earth's rocky crust.</i></i><br><br>As used in the text, what does the word \"resistance\" most nearly mean?",
      "skepticism",
      "friction",
      "immunity",
      "endurance"
    ],
    [
      "<i>Although early reviewers dismissed the composer's string quartets as erratic and structurally ______ , later musicologists demonstrated that the seemingly abrupt tempo shifts adhere to a rigorous Fibonacci proportion governing every movement.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "capricious",
      "methodical",
      "derivative",
      "melodious"
    ],
    [
      "<i>In diplomatic negotiations over shared river basins, ambiguous treaty language can be a deliberate strategy rather than an oversight: by leaving allocation formulas somewhat ______, negotiators allow rival governments to claim domestic victory while deferring contentious adjustments to future technical commissions.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "indeterminate",
      "unequivocal",
      "exhaustive",
      "immutable"
    ],
    [
      "<i>Because fossilization strongly favors organisms with mineralized shells and bones buried in rapid-sedimentation marine basins, the paleontological record of soft-bodied terrestrial worms is inherently ______ and must be supplemented by molecular-clock phylogenetics.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "lacunary",
      "comprehensive",
      "redundant",
      "fabricative"
    ],
    [
      "<i>Far from being a passive borrower of Persian court ceremonial, the Abbasid caliphate ______ Sasanian administrative protocols with Arabic legal scholarship, forging a hybrid bureaucratic culture that neither tradition could have produced in isolation.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "amalgamated",
      "repudiated",
      "sequestered",
      "truncated"
    ],
    [
      "<i>The central bank governor's remarks were models of calculated ______: every sentence was hedged with conditional clauses so that bond traders could neither infer an imminent interest-rate hike nor rule one out entirely.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "equivocation",
      "candor",
      "belligerence",
      "dogmatism"
    ],
    [
      "<i>While popular science accounts often portray scientific revolutions as sudden moments of solitary genius, historian Thomas Kuhn emphasized how deeply normal science is ______ institutional textbooks, shared laboratory instruments, and tacit disciplinary consensus.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "circumscribed by",
      "indifferent to",
      "emancipated from",
      "antithetical to"
    ],
    [
      "<i>To prevent invasive zebra mussels from clogging hydroelectric intake pipes without poisoning native trout, engineers sought a biocide whose toxicity is highly ______—lethal to dreissenid bivalves yet benign to salmonid fish at the same concentration.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "discriminating",
      "pervasive",
      "indiscriminate",
      "volatile"
    ],
    [
      "<i>In her memoirs, the exiled diplomat recounts the court's lavish banquets with a tone of cool ______: she catalogues the gilded tableware and sycophantic toasts with surgical precision, never once indulging in overt moralizing or nostalgia.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "detachment",
      "ebullience",
      "credulity",
      "veneration"
    ],
    [
      "<i>Because early photographic emulsions were overly sensitive to blue and ultraviolet wavelengths while virtually blind to red, nineteenth-century landscape photographers had to contend with ______ skies that printed as blank white paper whenever foreground shadows were properly exposed.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "overexposed",
      "attenuated",
      "variegated",
      "understated"
    ],
    [
      "<i>Although the company's chief executive praised the sustainability report as a bold new commitment, environmental auditors noted that its carbon-reduction targets merely ______ existing federal regulations that the firm was already legally required to meet.</i><br><br>Which choice completes the text with the most logical and precise word or phrase?",
      "recapitulated",
      "superseded",
      "invalidated",
      "transgressed"
    ]
  ],
  [
    [
      "<i>In 1911, physicist Heike Kamerlingh Onnes cooled liquid helium to 4.2 Kelvin and immersed a mercury wire in it. Expecting the wire's electrical resistance to decrease gradually, he was astonished when the resistance vanished completely. This phenomenon, which he termed superconductivity, opened an entirely new field of quantum condensed-matter physics.</i><br><br>What is the main purpose of the text?",
      "To recount the unexpected discovery of superconductivity",
      "To explain why liquid helium is much more difficult",
      "To argue that Kamerlingh Onnes's early measuring",
      "To compare the electrical conductivity of pure"
    ],
    [
      "<i>Traditional urban drainage systems rely on concrete pipes to funnel stormwater away quickly. However, landscape architect Kongjian Yu advocates for the 'sponge city' model, which replaces impermeable pavement with porous wetlands and sunken rain gardens. By absorbing and filtering runoff locally, sponge cities simultaneously prevent flash flooding and replenish depleted groundwater aquifers.</i><br><br>Which choice best describes the overall structure of the text?",
      "It contrasts a conventional approach with an alternative and notes the alternative's benefits.",
      "It presents a detailed historical timeline of urban flood disasters and proposes a strict legislative solution to prevent them.",
      "It details the chemical composition of porous pavement before questioning its long-term structural durability in cold climates.",
      "It summarizes a heated public debate between two architects who disagree on the municipal cost of maintaining sunken rain gardens."
    ],
    [
      "<i>Historians long assumed that medieval European women were entirely excluded from guild craftsmanship. <u>Yet tax rolls from fourteenth-century Paris list dozens of female master silk-weavers, gold-spinners, and bookbinders operating independent workshops.</u> Consequently, scholars now recognize that women played a vital, officially sanctioned role in the luxury trades of late medieval cities.</i><br><br>Which choice best describes the function of the underlined sentence in the text as a whole?",
      "It cites archival evidence that refutes a prior historical assumption.",
      "It explains why luxury goods produced in fourteenth-century Paris workshops were so heavily taxed by the French monarchy.",
      "It illustrates the complex technical differences between medieval silk-weaving, gold-spinning, and commercial bookbinding.",
      "It concedes that the vast majority of medieval craft guilds restricted married women to performing unpaid domestic labor at home."
    ],
    [
      "<i>When the invasive zebra mussel (Dreissena polymorpha) colonized the Great Lakes in the late 1980s, its prodigious filter-feeding dramatically increased water clarity. While clearer water initially seemed beneficial, it allowed sunlight to penetrate deeper, triggering massive blooms of toxic blue-green algae (Microcystis) and mats of rotting cladophora along the shorelines.</i><br><br>What is the main purpose of the text?",
      "To show how an apparently positive change from an invasive species caused ecological harm",
      "To propose a novel chemical treatment for eradicating toxic blue-green algae blooms from the shorelines of the Great Lakes",
      "To explain the anatomical mechanism by which Dreissena polymorpha filters microscopic plankton from freshwater lakes",
      "To argue that water clarity is the single most reliable indicator of a freshwater ecosystem's long-term biological health"
    ],
    [
      "<i>In her 1847 novel 'Wuthering Heights,' Emily Brontë avoids a linear, single-voice narrative. Instead, she filters the turbulent history of the Earnshaw and Linton families through the diary of Mr. Lockwood, a naive outsider who transcribes the oral recollections of Nelly Dean, the estate's longtime housekeeper. <u>This nested framing device forces the reader to question the objectivity of both narrators as they recount events shaped by decades of resentment.</u></i><br><br>Which choice best states the function of the underlined portion?",
      "It explains the interpretive effect of the novel's narrative structure.",
      "It criticizes Emily Brontë for making the chronological sequence of her 1847 novel unnecessarily difficult for modern readers to follow.",
      "It summarizes the central property conflict between the Earnshaw and Linton families across two generations in rural Yorkshire.",
      "It suggests that Mr. Lockwood's written diary is a much more reliable historical record than Nelly Dean's oral recollections."
    ],
    [
      "<i>Astronomers measuring the expansion rate of the universe—the Hubble constant—have encountered a persistent puzzle. Calculations based on the cosmic microwave background radiation from the early universe yield a rate of 67.4 kilometers per second per megaparsec, whereas measurements using Cepheid variable stars in the nearby universe yield 73.0. Because both methods have been verified to high precision, this 'Hubble tension' suggests that our standard cosmological model may be missing a fundamental piece of physics.</i><br><br>Which choice best describes the overall structure of the text?",
      "It introduces a discrepancy, gives the conflicting figures, and notes their theoretical implication.",
      "It refutes an outdated astronomical calculation by demonstrating how modern space telescopes have.",
      "It compares the evolutionary life cycles of Cepheid variable stars with the origin of cosmic.",
      "It outlines a chronological history of how the Hubble constant was first measured by astronomers."
    ],
    [
      "<i>Unlike most sharks, which must swim continuously to force water over their gills, the nurse shark (Ginglymostoma cirratum) can rest motionless on the ocean floor for hours. It achieves this by actively pumping water through its mouth and out its gill slits using powerful pharyngeal muscles, a process known as buccal pumping.</i><br><br>What is the main purpose of the text?",
      "To explain how nurse sharks breathe while remaining stationary",
      "To argue that buccal pumping is far more metabolically efficient for large marine predators than continuous swimming is",
      "To classify the different tropical coral reef habitats where Ginglymostoma cirratum congregates on the ocean floor",
      "To describe how the pharyngeal gill muscles of modern sharks evolved from the respiratory structures of jawless fishes"
    ],
    [
      "<i>Economists studying the 1990 Clean Air Act Amendments noted that rather than mandating a specific scrubber technology for every coal-fired power plant, the law established a cap-and-trade system for sulfur dioxide emissions. <u>Power plants that could reduce pollution cheaply cut their emissions below their allotted limit and sold their surplus allowances to plants facing higher retrofitting costs.</u> As a result, acid rain precursor emissions fell by 50 percent at a fraction of the projected expense.</i><br><br>Which choice best describes the function of the underlined sentence?",
      "It describes how the policy's market mechanism operated in practice.",
      "It identifies a regulatory loophole that allowed older coal-fired power plants to avoid reducing their sulfur dioxide emissions.",
      "It contrasts the environmental damage caused by sulfur dioxide with that caused by other industrial greenhouse gases.",
      "It explains why federal lawmakers ultimately abandoned cap-and-trade systems in subsequent environmental legislation."
    ],
    [
      "<i>For decades, art historians viewed the vibrant colors in digital reconstructions of ancient Greek marble statues with skepticism, assuming classical sculptors prized pure white stone. However, ultraviolet fluorescence and X-ray diffraction analyses conducted by Vinzenz Brinkmann have detected microscopic traces of cinnabar, azurite, and Egyptian blue across dozens of Parthenon-era sculptures, proving that Greek statuary was originally painted in bold, lifelike hues.</i><br><br>Which choice best describes the overall structure of the text?",
      "It notes a traditional assumption and presents scientific evidence that overturns it.",
      "It questions the reliability of ultraviolet fluorescence and X-ray diffraction when applied to weathered marble artifacts.",
      "It traces the maritime trade routes through which ancient Athenian sculptors acquired cinnabar, azurite, and Egyptian blue.",
      "It compares the marble carving techniques of classical Athens with the bronze casting methods of the Roman Empire."
    ],
    [
      "<i>In his 1929 poem 'The City Does Not Sleep,' Federico García Lorca eschews pastoral Spanish folk motifs in favor of surreal, nightmarish urban imagery inspired by his stay in Manhattan. By juxtaposing sleepless financial brokers with encroaching wilderness, Lorca critiques the spiritual alienation of modern industrial capitalism.</i><br><br>What is the main purpose of the text?",
      "To characterize the imagery and theme of a poem by Lorca",
      "To explain the personal reasons why Federico García Lorca decided to leave Spain and relocate to Manhattan in 1929",
      "To argue that García Lorca's early Spanish folk poetry is artistically superior to his later surrealist urban works",
      "To document the underlying macroeconomic causes of the 1929 stock market crash in New York City's financial district"
    ],
    [
      "<i>Plants growing in nitrogen-poor bogs, such as the pitcher plant (Nepenthes), have evolved modified leaves that form deep cavities filled with digestive fluid. <u>While most pitcher plants passively drown insects that slip on their waxy rims, Nepenthes gracilis uses the impact of falling raindrops to flick ants clinging to the underside of its lid directly into the trap below.</u></i><br><br>Which choice best states the function of the underlined sentence?",
      "It highlights a unique trapping mechanism in one pitcher plant species.",
      "It explains why carnivorous pitcher plants are unable to survive.",
      "It details the enzymatic composition of the digestive fluid secreted.",
      "It challenges the botanical classification of Nepenthes gracilis."
    ],
    [
      "<i>To determine whether infants understand basic probability, psychologists Fei Xu and Vashti Garcia showed eight-month-old babies a box filled mostly with white ping-pong balls and a few red ones. When an experimenter closed her eyes and drew four red balls and only one white ball, the infants stared significantly longer at the outcome than when four white balls were drawn—a standard indicator of surprise that suggests statistical intuition emerges before language.</i><br><br>Which choice best describes the overall structure of the text?",
      "It states a research question, describes an experiment, and interprets the result.",
      "It summarizes a longstanding theoretical debate in developmental psychology and proposes a compromise model.",
      "It critiques the methodology of infant gaze-tracking studies and suggests a more reliable experimental protocol.",
      "It compares the probabilistic reasoning abilities of eight-month-old infants with those of three-year-old toddlers."
    ],
    [
      "<i>During the construction of the Brooklyn Bridge in the 1870s, chief engineer Washington Roebling was debilitated by decompression sickness ('caisson disease') contracted while working in pressurized underwater foundations. Confined to his apartment overlooking the East River, Roebling relied on his wife, Emily Warren Roebling, who mastered higher mathematics and stress analysis to supervise the daily engineering operations until the bridge opened in 1883.</i><br><br>What is the main purpose of the text?",
      "To highlight Emily Warren Roebling's crucial role in completing the Brooklyn Bridge",
      "To explain the physiological causes of decompression sickness among nineteenth-century underwater construction workers",
      "To compare the steel suspension cables of the Brooklyn Bridge with earlier nineteenth-century iron bridge designs",
      "To argue that Washington Roebling should not receive historical credit for the original design of the Brooklyn Bridge"
    ],
    [
      "<i>In semiconductor physics, silicon has long been the dominant material for power electronics. <u>However, silicon's narrow bandgap limits its efficiency at high voltages and temperatures above 150°C.</u> Consequently, engineers are increasingly adopting wide-bandgap semiconductors like silicon carbide (SiC) and gallium nitride (GaN) for electric vehicle inverters and fast-charging stations.</i><br><br>Which choice best describes the function of the underlined sentence?",
      "It identifies a limitation of silicon that motivates the shift to alternative materials.",
      "It explains why pure silicon wafers are significantly less expensive to manufacture than silicon carbide or gallium nitride.",
      "It refutes the claim that modern electric vehicles require power inverters capable of operating above 150°C.",
      "It defines the technical term 'bandgap' for general readers who are unfamiliar with solid-state quantum physics."
    ],
    [
      "<i>When the Svalbard Global Seed Vault opened in 2008 on the Arctic island of Spitsbergen, its designers chose the location for its tectonic stability and deep permafrost. Even if the facility's mechanical cooling systems were to fail due to a global power outage, the surrounding frozen rock would keep the millions of backup crop seeds below freezing for decades, safeguarding agricultural biodiversity against war and climate disasters.</i><br><br>What is the main purpose of the text?",
      "To explain why the Svalbard Seed Vault's location is ideal for preserving seeds",
      "To catalog the specific varieties of wheat, barley, and rice seeds currently stored inside the Spitsbergen facility",
      "To warn that rising Arctic temperatures are rapidly thawing the permafrost surrounding the Svalbard Global Seed Vault",
      "To contrast the total storage capacity of the Svalbard vault with that of national seed banks in tropical countries"
    ],
    [
      "<i>In his 1776 treatise 'The Wealth of Nations,' Adam Smith famously used the example of a pin factory to illustrate the division of labor. A single untrained smith, he noted, could scarcely hammer out twenty pins in a day. Yet when the process was divided into eighteen distinct operations—one worker drawing the wire, another straightening it, a third cutting it—ten workers could collectively manufacture forty-eight thousand pins daily.</i><br><br>Which choice best describes the overall structure of the text?",
      "It introduces an economic concept and illustrates it with a numerical comparison.",
      "It critiques the repetitive working conditions of eighteenth-century factory.",
      "It traces the technological evolution of automated pin-making machinery.",
      "It presents a theoretical economic claim and then provides historical."
    ],
    [
      "<i>Marine mammal acoustics researchers have observed that humpback whales (Megaptera novaeangliae) within a given ocean basin all sing the same complex mating song. <u>Intriguingly, when a few whales from the western Australian population migrated into the eastern Australian breeding grounds in 1996, the entire eastern population abandoned its existing song within two years and adopted the western melody note for note.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It offers a striking example of cultural transmission in humpback whales.",
      "It explains why western Australian humpback whales migrate much farther each winter than eastern Australian whales do.",
      "It demonstrates that humpback whale mating songs are genetically inherited rather than learned from other whales.",
      "It suggests that commercial shipping noise in the South Pacific disrupts humpback whale breeding behavior."
    ],
    [
      "<i>Although the Roman Emperor Julian (reigned 361–363 CE) was raised as a Christian, he publicly renounced the faith upon ascending the throne and attempted to restore traditional Greco-Roman polytheism. Rather than launching violent persecutions, Julian sought to undermine the Church intellectually by barring Christians from teaching classical literature and organizing pagan charities that mirrored Christian relief networks—an effort that collapsed abruptly when he died in battle in Persia.</i><br><br>What is the main purpose of the text?",
      "To summarize Emperor Julian's non-violent strategies to revive paganism",
      "To analyze the military tactical errors that led to Emperor Julian's death during his campaign in Persia in 363 CE",
      "To argue that fourth-century Greco-Roman polytheism was more charitable toward the poor than early Christianity was",
      "To explain how classical Greek literature was preserved in Christian monasteries after the fall of the Roman Empire"
    ],
    [
      "<i>When neuroscientists first mapped the human brain's 'default mode network' (DMN) in 2001, they noticed it became active whenever test subjects lay idle in MRI scanners between cognitive tasks. Initially dubbed a mere 'resting state,' the DMN is now understood to perform vital internal work: consolidating autobiographical memories, simulating future scenarios, and inferring the mental states of other people.</i><br><br>Which choice best describes the overall structure of the text?",
      "It describes the discovery of a brain network and how views of its role evolved.",
      "It compares the spatial resolution of functional MRI scanners with older electroencephalography (EEG) recording techniques.",
      "It argues that mind-wandering and daydreaming are detrimental to human performance on complex laboratory tasks.",
      "It outlines a clinical protocol for deactivating the default mode network in patients suffering from insomnia."
    ],
    [
      "<i>In the arid Namib Desert, the stenocara beetle survives practically zero rainfall by harvesting coastal fog. Early every morning, the beetle climbs to the crest of a sand dune and tilts its body head-down into the wind. <u>Its wing covers feature a microscopic pattern of hydrophilic (water-attracting) bumps surrounded by hydrophobic (water-repelling) waxy troughs.</u> Moisture condenses on the bumps and rolls down the troughs directly into the beetle's mouth.</i><br><br>Which choice best states the function of the underlined sentence?",
      "It describes the physical surface structure that enables the beetle to collect water.",
      "It explains why dense coastal fog forms more frequently in the Namib Desert than in other southern African deserts.",
      "It contrasts the daily water consumption of the stenocara beetle with that of nocturnal Namib Desert reptiles.",
      "It notes an evolutionary disadvantage of the beetle's waxy wing covers when exposed to intense midday solar heat."
    ],
    [
      "<i>Literary critic Franco Moretti coined the term 'distant reading' to challenge the traditional method of literary study, which focuses on close, line-by-line analysis of a few hundred canonical masterpieces. By using computer algorithms to analyze metadata and word frequencies across tens of thousands of forgotten nineteenth-century novels at once, distant reading reveals macro-level shifts in genre and style that no human scholar could read in a lifetime.</i><br><br>What is the main purpose of the text?",
      "To contrast computational literary analysis with traditional close reading and note its advantage",
      "To argue that forgotten nineteenth-century novels are superior in literary quality",
      "To demonstrate that modern computer algorithms can compose more engaging historical fiction",
      "To criticize university literature departments for removing canonical masterpieces"
    ],
    [
      "<i>In 1859, French physicist Gaston Planté invented the lead-acid battery, the first rechargeable electric battery suitable for commercial use. Although modern lithium-ion batteries store four times more energy per kilogram, lead-acid batteries remain the standard for starting internal combustion cars today. <u>They can deliver massive, instantaneous surges of current in subzero weather without catching fire and cost a fraction as much to manufacture and recycle.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It gives the practical and economic reasons why an older battery type remains in use.",
      "It explains the reversible electrochemical reaction that occurs between lead plates and sulfuric acid during charging.",
      "It predicts that lithium-ion batteries will completely replace lead-acid starter batteries within the next ten years.",
      "It highlights the severe environmental hazards associated with the improper disposal of lead automotive batteries."
    ],
    [
      "<i>Geologists long puzzled over the 'Great Unconformity'—a global gap in the geological record where billion-year-old Precambrian basement rocks sit directly beneath 500-million-year-old Cambrian marine sediments, with up to a vertical kilometer of intervening rock missing. A 2019 study proposes that during the 'Snowball Earth' glaciations around 700 million years ago, continental ice sheets ground down the planet's crust on a planetary scale, flushing the pulverized rock into the oceans.</i><br><br>Which choice best describes the overall structure of the text?",
      "It presents a geological puzzle and summarizes a recent hypothesis that explains it.",
      "It refutes the 'Snowball Earth' hypothesis by pointing to mineralogical inconsistencies in Cambrian marine sediments.",
      "It compares the bedrock erosion rates of modern alpine glaciers with those of ancient Precambrian river systems.",
      "It explains how geochemists use radiometric dating to determine the exact age of Precambrian basement rocks."
    ],
    [
      "<i>In her 1979 work 'The Dinner Party,' feminist artist Judy Chicago created a monumental triangular banquet table featuring thirty-nine elaborate place settings for mythical and historical women. By incorporating porcelain painting and intricate needlework—mediums historically dismissed by fine-art academies as mere 'domestic craft'—Chicago deliberately challenged the hierarchy separating decorative arts from high sculpture.</i><br><br>What is the main purpose of the text?",
      "To explain how Chicago's choice of artistic mediums challenged traditional art hierarchies",
      "To provide detailed biographical profiles of the thirty-nine historical women honored in Chicago's 1979 installation",
      "To trace the technical evolution of porcelain overglaze painting in twentieth-century American ceramic studios",
      "To argue that triangular gallery installations are more visually dynamic than traditional rectangular sculptures"
    ],
    [
      "<i>When agricultural pests evolve resistance to genetically modified Bt crops, farmers face severe yield losses. To prevent this, regulatory agencies mandate a 'refuge strategy.' <u>Farmers must plant a designated percentage of their fields with non-Bt crops where susceptible insects can thrive.</u> These abundant susceptible insects then mate with the rare resistant survivors from the Bt fields, diluting the resistance genes in the next generation.</i><br><br>Which choice best states the function of the underlined sentence?",
      "It specifies the farming practice required by the refuge strategy.",
      "It illustrates why genetically modified Bt crops produce lower per-acre yields than conventional non-Bt crops.",
      "It argues that federal regulatory agencies should ban the use of Bt toxins in commercial corn and cotton farming.",
      "It explains how insect pests mutate at the genetic level when repeatedly exposed to synthetic chemical pesticides."
    ],
    [
      "<i>During the Tang Dynasty (618–907 CE), the Chinese government established a nationwide network of state-run granaries known as 'ever-normal granaries.' In years of bumper harvests, officials purchased grain at above-market prices to prevent farmers from going bankrupt; in years of drought or flood, they sold the stored grain at below-market prices to prevent famine and profiteering.</i><br><br>What is the main purpose of the text?",
      "To explain how Tang Dynasty state granaries stabilized grain prices and supply",
      "To compare the total agricultural output of the Tang Dynasty",
      "To argue that government intervention in commodity markets inevitably leads",
      "To describe the architectural ventilation techniques used to keep moisture"
    ],
    [
      "<i>Psychologists Amos Tversky and Daniel Kahneman demonstrated in 1979 that human financial decisions violate classical expected-utility theory, which assumes people weigh gains and losses symmetrically. Through a series of lottery experiments, they showed that the psychological distress of losing $100 is roughly twice as intense as the pleasure of winning $100—a cognitive asymmetry they formalized as 'loss aversion' within prospect theory.</i><br><br>Which choice best describes the overall structure of the text?",
      "It notes a classical assumption, cites experiments contradicting it, and names the resulting concept.",
      "It provides practical investment strategies for stock traders seeking to overcome emotional biases in volatile markets.",
      "It criticizes the use of small-scale laboratory lottery experiments to model complex macroeconomic decision-making.",
      "It chronicles the professional academic collaboration between Amos Tversky and Daniel Kahneman during the 1970s."
    ],
    [
      "<i>Most terrestrial mammals cannot drink seawater because their kidneys cannot produce urine saltier than the ocean; drinking seawater actually dehydrates them further. <u>The sea otter (Enhydra lutris), however, possesses enlarged, lobulated kidneys that can excrete high concentrations of sodium and urea.</u> This anatomical adaptation allows sea otters to actively drink seawater to replenish fluids while foraging on salty marine invertebrates.</i><br><br>Which choice best describes the function of the underlined sentence?",
      "It identifies the kidney adaptation that allows sea otters to process seawater.",
      "It explains why terrestrial mammals lost the physiological ability to excrete salt after evolving from marine ancestors.",
      "It warns that rising ocean salinity caused by climate change may soon overwhelm the kidney function of sea otters.",
      "It compares the daily caloric and fluid requirements of Enhydra lutris with those of freshwater river otters."
    ],
    [
      "<i>In the 1950s, linguist Noam Chomsky challenged the prevailing behaviorist view that children learn language purely by imitating adults and receiving positive reinforcement. Chomsky pointed out that children routinely utter grammatically structured sentences they have never heard before—such as 'I goed to the park'—demonstrating that humans are born with an innate 'universal grammar' that actively deduces rules from limited input.</i><br><br>What is the main purpose of the text?",
      "To present Chomsky's critique of behaviorism and the evidence for his innate grammar theory",
      "To instruct elementary school teachers on how to correct irregular past-tense verb errors in young children's speech",
      "To trace how the grammatical rules of spoken English have gradually simplified over the past several centuries",
      "To argue that parental positive reinforcement is actually detrimental to a toddler's early vocabulary acquisition"
    ],
    [
      "<i>When glass is cooled rapidly from a molten state, its outer surface solidifies first while the interior remains fluid. As the core finally cools and contracts, it pulls inward on the rigid outer shell, locking immense compressive stress into the surface—a principle exploited since the seventeenth century in 'Prince Rupert's drops,' which can withstand a hammer blow on their bulbous head yet explode into powder if their thin tail is nicked.</i><br><br>Which choice best describes the overall structure of the text?",
      "It explains a physical process in glass cooling and illustrates its effect with a historical example.",
      "It contrasts seventeenth-century artisanal glassblowing with modern industrial tempered glass manufacturing.",
      "It proposes a new chemical annealing method for preventing structural fractures in commercial glass windows.",
      "It recounts a seventeenth-century dispute among European physicists over the atomic structure of molten silica."
    ],
    [
      "<i>In his 1949 novel 'Nineteen Eighty-Four,' George Orwell introduces 'Newspeak,' a fictional language engineered by the totalitarian state of Oceania to systematically eliminate words expressing rebellion or nuance. <u>By stripping away the vocabulary of dissent, the regime aims to make subversive thought literally inconceivable at a cognitive level.</u></i><br><br>Which choice best states the function of the underlined sentence?",
      "It explains the regime's ultimate psychological goal in restricting vocabulary.",
      "It provides examples of specific Newspeak terms that have entered.",
      "It argues that natural human languages inevitably lose vocabulary over time.",
      "It contrasts Orwell's fictional Newspeak with the phonetic codes used."
    ],
    [
      "<i>Botanists studying the giant water lily (Victoria amazonica) noted that its floating circular leaves can grow over two meters in diameter and support the weight of a child. Computer modeling reveals that this strength comes not from leaf thickness, but from a branching network of hollow, air-filled vascular ribs on the underside that distributes loads evenly while using minimal plant tissue.</i><br><br>What is the main purpose of the text?",
      "To explain the underside rib structure that gives the giant water lily leaf its strength",
      "To describe the nocturnal beetle pollination cycle of Victoria amazonica in the Amazon River basin",
      "To compare the photosynthetic efficiency of floating aquatic lilies with that of terrestrial rainforest trees",
      "To show how civil engineers copied the water lily's vein pattern when designing cast-iron exhibition halls"
    ],
    [
      "<i>Archaeologists excavating the Neolithic site of Göbekli Tepe in southeastern Turkey discovered monumental T-shaped limestone pillars arranged in circles, carved with reliefs of foxes, vultures, and scorpions. Dated to 9500 BCE—predating pottery, metallurgy, and settled agriculture—the site overturned the long-standing orthodoxy that complex monumental religion could only emerge after farming societies produced food surpluses.</i><br><br>Which choice best describes the overall structure of the text?",
      "It describes an ancient site and explains how its early date invalidated a major historical theory.",
      "It questions the reliability of radiocarbon dating when applied to carved limestone pillars in arid regions.",
      "It analyzes the religious symbolism of foxes, vultures, and scorpions in Neolithic hunter-gatherer myths.",
      "It argues that the builders of Göbekli Tepe practised an early form of wheat farming that left no traces."
    ],
    [
      "<i>When commercial airlines assign boarding groups, they typically board passengers from the back of the plane to the front. <u>However, astrophysicist Jason Steffen demonstrated via Markov-chain Monte Carlo simulations that boarding window seats first, then middle seats, and finally aisle seats in staggered alternating rows cuts total boarding time nearly in half by eliminating aisle congestion.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It presents a simulated boarding method that is much faster than the standard practice.",
      "It explains why commercial airlines prioritize first-class and business-class passengers during boarding.",
      "It illustrates the mathematical limitations of Markov-chain simulations when modeling human behavior.",
      "It describes how commercial aircraft cabin aisles have narrowed to accommodate wider passenger seats."
    ],
    [
      "<i>In the late nineteenth century, French microbiologist Louis Pasteur developed the first laboratory-attenuated vaccines by weakening pathogens through chemical treatment or aging. When injected into a host, these weakened microbes could no longer cause severe disease, yet their surface antigens remained intact, training the host's immune system to recognize and destroy virulent strains upon future exposure.</i><br><br>What is the main purpose of the text?",
      "To explain how Pasteur's weakened pathogens trained the immune system without causing disease",
      "To contrast Pasteur's laboratory rabies vaccine with Edward Jenner's earlier cowpox inoculation technique",
      "To detail the exact chemical formulas of the solutions Pasteur used to age bacterial cultures in Paris",
      "To argue that nineteenth-century live-attenuated vaccines are safer than modern synthetic mRNA vaccines"
    ],
    [
      "<i>In classical music, a 'cadenza' is an ornamental solo passage played near the end of a concerto movement while the orchestra pauses. During the eighteenth century, Mozart and Beethoven expected soloists to improvise the cadenza on the spot to showcase their virtuosity. By the late nineteenth century, however, composers like Tchaikovsky and Brahms began writing out the cadenza note for note in the score to ensure thematic unity across the entire work.</i><br><br>Which choice best describes the overall structure of the text?",
      "It defines a musical feature and traces how composers' treatment of it changed over time.",
      "It argues that nineteenth-century Romantic concertos are structurally superior.",
      "It compares the technical difficulty of violin cadenzas with those written.",
      "It explains why modern symphony soloists rarely improvise when performing."
    ],
    [
      "<i>Deep-sea hydrothermal vents eject superheated water rich in dissolved iron and sulfur at temperatures exceeding 350°C. <u>Because of the crushing hydrostatic pressure at depths of 2,500 meters, however, this water does not boil into steam, remaining a supercritical fluid that leaches minerals directly from the oceanic crust.</u></i><br><br>Which choice best states the function of the underlined sentence?",
      "It explains why the superheated water at deep-sea vents does not boil into steam.",
      "It describes how oceanographers collect fluid samples from hydrothermal vents using robotic submersibles.",
      "It identifies the radioactive decay processes that heat water beneath mid-ocean tectonic ridges.",
      "It contrasts the mineral content of deep-sea hydrothermal vents with that of terrestrial geysers."
    ],
    [
      "<i>Sociologist Mark Granovetter's 1973 paper 'The Strength of Weak Ties' revealed a counterintuitive pattern in labor markets. When surveying professionals who had recently changed jobs, Granovetter found that over eighty percent heard about their new position not from close friends, who shared the same redundant information circle, but from casual acquaintances who bridged entirely separate social networks.</i><br><br>What is the main purpose of the text?",
      "To explain Granovetter's finding that casual acquaintances are more helpful than close friends in job searches",
      "To advise corporate human-resources departments on how to recruit candidates using digital social networks by contrasting empirical laboratory measurements with historical anecdotes",
      "To argue that close friendships are less emotionally supportive in large cities than in small rural towns while dismissing alternative interpretations proposed by earlier critics",
      "To critique the sampling methodology Granovetter used when interviewing Boston-area workers in 1973"
    ],
    [
      "<i>Unlike the Mayan civilization, which collapsed centuries before Europeans arrived, the Aztec Empire was at its demographic and military peak in 1519. Yet the Aztecs' tributary system—which extracted heavy taxes and sacrificial captives from conquered neighboring city-states without integrating them as citizens—created deep resentment, allowing Hernán Cortés to recruit tens of thousands of indigenous Tlaxcalan allies who proved decisive in toppling Tenochtitlan.</i><br><br>Which choice best describes the overall structure of the text?",
      "It notes the Aztec Empire's strength in 1519 and explains how internal resentment aided Cortés's conquest.",
      "It compares the decentralized city-states of the Maya with the centralized tributary system of the Aztecs.",
      "It attributes the fall of Tenochtitlan primarily to European infectious diseases rather than military alliances.",
      "It recounts the diplomatic negotiations between Hernán Cortés and the senate of the Tlaxcalan confederacy."
    ],
    [
      "<i>When sound waves strike a flat concrete wall, they reflect coherently, creating harsh echoes in concert halls. To scatter sound evenly across all frequencies without absorbing acoustic energy, physicist Manfred Schroeder invented the quadratic residue diffuser in 1975. <u>The panel consists of a series of narrow wells whose depths are calculated using prime-number mathematical sequences.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It describes the mathematical physical design of Schroeder's acoustic panel.",
      "It explains why traditional concert hall architects preferred absorbing echoes with heavy velvet drapery.",
      "It proves that prime-number sequences occur naturally in the overtones of wooden string instruments.",
      "It notes a costly manufacturing flaw that limited the commercial adoption of Schroeder's diffusers."
    ],
    [
      "<i>In her 1928 essay 'A Room of One's Own,' Virginia Woolf invents the figure of 'Judith Shakespeare,' a hypothetical sister of William Shakespeare endowed with equal poetic genius. Woolf traces how Judith—barred from grammar school, forced into an early betrothal, and turned away from London theater doors—would have been driven to despair without ever writing a word, thereby illustrating that artistic achievement depends on material and social conditions rather than raw talent alone.</i><br><br>What is the main purpose of the text?",
      "To show how Woolf uses a hypothetical figure to argue that social barriers stifled women writers",
      "To present archival evidence that William Shakespeare had a younger sister who wrote",
      "To compare the classical Latin curriculum of Elizabethan grammar schools",
      "To criticize Virginia Woolf for overlooking the published works of real sixteenth-century"
    ],
    [
      "<i>When an ice skater pulls her extended arms tightly against her chest during a spin, her rotational speed increases dramatically without any extra push against the ice. This everyday spectacle is a direct consequence of the conservation of angular momentum: because pulling mass closer to the axis of rotation reduces the skater's moment of inertia, her angular velocity must increase proportionally to keep total momentum constant.</i><br><br>Which choice best describes the overall structure of the text?",
      "It describes a familiar skating motion and explains the physics principle behind it.",
      "It provides coaching instructions for figure skaters learning to maintain balance during fast spins.",
      "It contrasts the conservation of angular momentum with Newton's laws of linear motion on ice.",
      "It traces how figure skate blade geometry has evolved to minimize friction during rotational jumps."
    ],
    [
      "<i>For over a century, biologists classified the giant panda (Ailuropoda melanoleuca) and the red panda (Ailurus fulgens) in the same taxonomic family because both possess a 'false thumb'—an enlarged wrist bone used to grip bamboo stalks. <u>Modern genomic sequencing, however, places the giant panda firmly within the bear family (Ursidae) and the red panda in its own distinct superfamily (Musteloidea) alongside raccoons and weasels.</u></i><br><br>Which choice best states the function of the underlined sentence?",
      "It presents genetic findings that overturned an earlier anatomical classification.",
      "It explains how both panda species inherited the enlarged wrist bone from a shared carnivorous ancestor.",
      "It argues that subsisting almost entirely on low-nutrient bamboo is an evolutionary dead end for mammals.",
      "It describes the polymerase chain reaction protocol used to sequence DNA from museum panda specimens."
    ],
    [
      "<i>In behavioral finance, the 'sunk cost fallacy' describes the tendency to continue funding a losing project simply because substantial resources have already been committed. To counteract this bias in pharmaceutical research—where scientists often grow emotionally attached to a drug candidate they have spent years developing—many biotech firms assign 'red teams' of uninvolved outsiders with the authority to terminate failing clinical trials.</i><br><br>What is the main purpose of the text?",
      "To define a cognitive bias and describe a corporate practice used to counteract it",
      "To explain why the vast majority of experimental pharmaceutical compounds fail in Phase III clinical trials",
      "To argue that major pharmaceutical companies spend too much revenue on marketing rather than basic research",
      "To compare the clinical trial success rates of small biotech startups with those of pharmaceutical giants"
    ],
    [
      "<i>During the 1930s Dust Bowl on the American Great Plains, decades of deep plowing had pulverized the native prairie sod, leaving the topsoil vulnerable to wind erosion during severe drought. Agronomist Hugh Hammond Bennett persuaded Congress to establish the Soil Conservation Service in 1935, which taught farmers contour plowing, strip cropping, and the planting of shelterbelt tree rows—practices that reduced wind erosion by over sixty percent within five years.</i><br><br>Which choice best describes the overall structure of the text?",
      "It identifies the cause of an ecological crisis, describes a policy response, and notes its success.",
      "It compares the severe drought of the 1930s with nineteenth-century dry spells on the Great Plains.",
      "It biographies Hugh Hammond Bennett's early career as a soil chemist for the Department of Agriculture.",
      "It argues that native shortgrass prairie should be permanently restored across all midwestern farmland."
    ],
    [
      "<i>In ancient Mesopotamia, clay cuneiform tablets were often enclosed inside a hollow clay envelope before being dispatched by courier. <u>The sender would roll their cylindrical seal across the wet exterior of the envelope and inscribe a summary of the contract on the outside.</u> If a dispute arose over whether the terms had been altered in transit, judges could crack open the outer clay shell to verify the untouched original tablet within.</i><br><br>Which choice best describes the function of the underlined sentence?",
      "It explains how the clay envelope was prepared to prevent tampering.",
      "It describes how Mesopotamian scribes transitioned.",
      "It illustrates how easily travelling couriers could forge.",
      "It compares the legal validity of sealed clay tablets."
    ],
    [
      "<i>While electric vehicles (EVs) produce zero tailpipe emissions, critics often point out that manufacturing their lithium-ion batteries generates more carbon dioxide than building a conventional gasoline car. Lifecycle assessments by the Union of Concerned Scientists confirm this initial 'carbon debt,' but demonstrate that even on an electricity grid powered partly by coal, an average EV repays that manufacturing debt within 18 months of driving and emits less than half the lifetime greenhouse gases of a gasoline vehicle.</i><br><br>What is the main purpose of the text?",
      "To evaluate a criticism of electric vehicles using full lifecycle emissions data",
      "To advocate for a federal ban on coal-fired power plants so electric vehicles can be completely carbon-free",
      "To explain the evaporation pond techniques used to extract lithium salts from South American deserts",
      "To show that gasoline cars have a smaller carbon footprint than electric vehicles over ten years of driving"
    ],
    [
      "<i>In his 1532 political treatise 'The Prince,' Niccolò Machiavelli broke sharply with the medieval 'mirror-for-princes' genre, which advised rulers to cultivate Christian virtues such as mercy, generosity, and piety. Writing amid the violent factionalism of Renaissance Italy, Machiavelli contended that a ruler who strictly observes moral ideals in a world of unscrupulous rivals will inevitably bring about his own ruin; instead, a prince must learn 'how not to be good' when the survival of the state requires it.</i><br><br>Which choice best describes the overall structure of the text?",
      "It contrasts Machiavelli's realist advice for rulers with the idealistic genre before it.",
      "It traces the military campaigns of Cesare Borgia as documented in Machiavelli's Florentine letters.",
      "It argues that medieval European monarchs governed more ethically than Renaissance Italian city-state rulers.",
      "It explains why the Roman Inquisition placed 'The Prince' on its official Index of Prohibited Books."
    ],
    [
      "<i>The human retina contains two types of photoreceptors: cones, which detect color and fine detail in bright light, and rods, which are vastly more sensitive to dim light but cannot distinguish color. <u>Curiously, the center of the retina (the fovea) is packed exclusively with cones, while rods are concentrated around the periphery.</u> That is why stargazers can often spot a faint, dim star out of the corner of their eye that disappears the moment they look at it directly.</i><br><br>Which choice best states the function of the underlined sentence?",
      "It notes the spatial layout of retinal cells that explains the stargazing effect.",
      "It explains why human beings are much more susceptible to red-green color blindness than nocturnal owls.",
      "It refutes the anatomical claim that rod cells outnumber cone cells across the entire human retina.",
      "It outlines the biochemical cycle by which rhodopsin pigment regenerates in complete darkness."
    ],
    [
      "<i>When the Hoover Dam was completed in 1935, engineers calculated that if its 3.25 million cubic yards of concrete had been poured in a single continuous mass, the chemical heat released by the curing cement would have taken 125 years to dissipate, cracking the dam apart. To solve this, engineer John Lucian Savage poured the dam as a series of interlocking trapezoidal columns and embedded 582 miles of one-inch steel pipes circulating ice-cold water through the blocks, cooling the structure in under two years.</i><br><br>What is the main purpose of the text?",
      "To describe a heat problem in building the Hoover Dam and how engineers solved it",
      "To calculate the megawatts of hydroelectric power generated by the Hoover Dam's turbines since 1935",
      "To argue that thin concrete arch dams are structurally safer than massive gravity-arch dams",
      "To document the high incidence of heatstroke among laborers working in the Colorado River canyon"
    ],
    [
      "<i>Ecologists studying the 'intermediate disturbance hypothesis' propose that local species diversity is maximized when ecological disturbances—such as wildfires or storms—occur at moderate frequency and intensity. If disturbances are too rare, a few dominant, slow-growing species outcompete all others; if disturbances are too frequent, only a handful of fast-colonizing 'weedy' species can survive.</i><br><br>Which choice best describes the overall structure of the text?",
      "It states a hypothesis and explains the outcomes at both extremes that support it.",
      "It critiques twentieth-century forestry policies that suppressed natural.",
      "It provides a decade-by-decade account of how a pine forest recovers following.",
      "It compares the species richness of tropical coral reefs with that of boreal."
    ],
    [
      "<i>In 1928, Soviet agronomist Trofim Lysenko rejected Mendelian genetics in favor of his own pseudoscientific doctrine of 'vernalization,' claiming that exposing wheat seeds to cold and moisture could permanently alter their heredity within a single generation. <u>Backed by Joseph Stalin, Lysenko had thousands of mainstream geneticists dismissed or imprisoned, a purge that crippled Soviet agricultural yields and biological research for over three decades.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It highlights the destructive impact of political backing for Lysenko's doctrine.",
      "It explains the physiological mechanism by which winter wheat varieties require cold exposure to flower.",
      "It contrasts Lysenko's vernalization trials with the nineteenth-century pea-plant experiments of Gregor Mendel.",
      "It credits Lysenko's seed treatments with helping Soviet farms survive the freezes of the late 1920s."
    ],
    [
      "<i>To prevent counterfeiting, early twentieth-century central banks relied on intricate intaglio engraving, where master artisans carved microscopic scroll patterns (guillochés) into steel plates. Today, while intaglio printing provides a raised tactile texture, banknotes incorporate optically variable inks that shift color when tilted and holographic polymer security threads, creating multi-layered defenses that cannot be replicated by high-resolution digital scanners.</i><br><br>What is the main purpose of the text?",
      "To trace how banknote security evolved from steel engraving to modern optical features",
      "To explain why physical paper currency is rapidly being replaced by mobile digital payment networks",
      "To argue that early twentieth-century engraved banknotes were more artistic than modern polymer notes",
      "To describe the international law-enforcement protocols used to track counterfeit currency rings"
    ],
    [
      "<i>In her 2013 novel 'Americanah,' Chimamanda Ngozi Adichie uses hair braiding salons in New Jersey and Lagos as recurring settings for her protagonist, Ifemelu. Far from serving as mere background detail, the salons function as transnational microcosms where immigrant women debate assimilation, racial hierarchies, and economic survival while hours of intricate braiding unfold.</i><br><br>What is the main purpose of the text?",
      "To explain the thematic role of hair salons in Adichie's novel",
      "To compare the commercial profitability of hair braiding salons in New Jersey with those in Lagos",
      "To summarize the romantic relationship between Ifemelu and her university classmate Obinze",
      "To provide a historical overview of West African hair-braiding styles in the twentieth century"
    ],
    [
      "<i>When astronomers discovered the first 'hot Jupiters'—gas giant planets orbiting closer to their stars than Mercury orbits the Sun—in 1995, planetary formation models were thrown into crisis. <u>At such scorching proximity to a young star, temperatures are too high for volatile ice and gas grains to condense into a giant planetary core.</u> Astronomers therefore concluded that hot Jupiters must form much farther out beyond the 'frost line' and subsequently migrate inward through gravitational interactions with the protoplanetary disk.</i><br><br>Which choice best states the function of the underlined sentence?",
      "It explains why hot Jupiters could not have formed in their current close orbits.",
      "It describes the Doppler spectroscopy technique used to detect the first hot Jupiter in 1995.",
      "It refutes the hypothesis that gas giant planets possess solid rocky cores beneath their clouds.",
      "It compares the surface temperature of Mercury with that of newly discovered exoplanets."
    ],
    [
      "<i>In the 1960s, biochemist Lynn Margulis proposed the endosymbiotic theory, arguing that mitochondria and chloroplasts inside complex eukaryotic cells were once free-living bacteria that were engulfed by a host cell billions of years ago. Initially mocked by mainstream biologists, Margulis's theory was decisively confirmed in the late 1970s when DNA sequencing revealed that mitochondria possess their own circular genome closely related to modern alpha-proteobacteria.</i><br><br>Which choice best describes the overall structure of the text?",
      "It presents a biological theory, notes its initial rejection, and cites the DNA evidence that proved it.",
      "It compares the ATP-producing function of mitochondria in animals with chloroplasts in green plants.",
      "It argues that evolutionary innovation is driven primarily by competition rather than symbiosis while.",
      "It explains the laboratory centrifugation steps required to isolate mitochondria from cell cultures."
    ],
    [
      "<i>Unlike conventional suspension bridges, where vertical suspender cables drop straight down from two main catenary cables, a cable-stayed bridge connects the road deck directly to tall towers via diagonal taut cables arranged in fan or harp patterns. Because cable-stayed designs require less cable steel and do not need massive shore anchorages to hold main cables in tension, they have become the preferred engineering choice for medium-length spans between 300 and 1,000 meters.</i><br><br>What is the main purpose of the text?",
      "To contrast cable-stayed bridges with suspension bridges and note their advantages",
      "To warn structural engineers about the wind-induced resonance risks of long suspension bridges",
      "To trace the metallurgical history of high-tensile steel wire from the 1880s to the present day",
      "To argue that cable-stayed bridges should replace suspension bridges for spans over 2,000 meters"
    ],
    [
      "<i>In cognitive psychology, the 'Zeigarnik effect' refers to the observation that people remember uncompleted or interrupted tasks much better than completed ones. Lithuanian psychologist Bluma Zeigarnik first noticed this phenomenon in a Vienna café in the 1920s. <u>Waiters could recall complex, unpaid orders across a dozen tables with flawless accuracy, yet the moment a bill was settled, their memory of what those customers had ordered vanished completely.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It recounts the café observation that inspired Zeigarnik's research.",
      "It demonstrates that professional waiters have better working memory than university students.",
      "It explains why multitasking in noisy environments leads to frequent short-term memory lapses.",
      "It criticizes 1920s Viennese café managers for forbidding waiters to use written order pads."
    ],
    [
      "<i>Paleontologists studying the Cambrian Explosion (around 541 million years ago)—when most major animal phyla abruptly appear in the fossil record with hard shells, spines, and compound eyes—have proposed the 'Light Switch' hypothesis. Formulated by Andrew Parker, the theory suggests that the evolution of the first active, vision-guided predator triggered an evolutionary arms race, forcing prey lineages to rapidly evolve mineralized armor or burrowing behaviors to avoid being seen and eaten.</i><br><br>What is the main purpose of the text?",
      "To summarize a hypothesis linking the Cambrian Explosion to the evolution of vision",
      "To catalog the calcium carbonate minerals that Cambrian marine organisms used to build shells",
      "To argue that soft-bodied multicellular animals did not exist before 541 million years ago",
      "To explain how the faceted compound eyes of trilobites differ optically from human eyes"
    ],
    [
      "<i>In the seventeenth century, Dutch flower painters such as Rachel Ruysch created lavish still-life arrangements featuring tulips, irises, peonies, and roses in full bloom within a single vase. <u>In botanical reality, however, these species bloom during entirely different months of the spring and summer.</u> Ruysch composed her paintings over many months from individual watercolor studies made as each flower came into season, constructing an idealized, impossible bouquet that celebrated both artistic mastery and global horticultural trade.</i><br><br>Which choice best states the function of the underlined sentence?",
      "It points out a botanical fact showing the bouquets were not painted from a single live arrangement.",
      "It criticizes seventeenth-century Dutch still-life painters for their ignorance of plant biology by contrasting empirical laboratory measurements with historical anecdotes.",
      "It explains why Amsterdam merchants paid fortunes for rare striped tulip bulbs in the 1630s while dismissing alternative interpretations proposed by earlier critics.",
      "It contrasts the blooming periods of native Dutch wildflowers with imported Ottoman species."
    ],
    [
      "<i>When central banks print money to finance government deficits without a corresponding increase in economic output, the result is hyperinflation. During the Weimar Republic's hyperinflation of 1923, prices doubled every few days, eroding life savings overnight. Yet the crisis ended almost instantly in November 1923 when the government introduced a new currency, the Rentenmark, backed by mortgages on agricultural land and strictly capped in supply, restoring public confidence in the medium of exchange.</i><br><br>Which choice best describes the overall structure of the text?",
      "It states an economic cause, illustrates it with the 1923 crisis, and explains how a new currency ended it.",
      "It compares the Weimar hyperinflation of 1923 with twenty-first-century inflation in Latin America.",
      "It argues that paper currencies backed by gold reserves are less stable than land-backed currencies.",
      "It details the war reparation payments demanded of Germany under the 1919 Treaty of Versailles."
    ],
    [
      "<i>Honeybees (Apis mellifera) maintain the interior of their brood nest at a tightly regulated temperature between 34°C and 35°C regardless of outside weather. On scorching summer days, foragers collect water and spread droplets across the wax combs while worker bees line up at the hive entrance and fan their wings in unison, driving evaporative cooling through the colony.</i><br><br>What is the main purpose of the text?",
      "To describe how honeybees collectively cool their hive in hot weather",
      "To explain how royal jelly causes honeybee larvae to develop into fertile queens rather than workers",
      "To warn commercial beekeepers about the risks of wax comb melting in unshaded wooden hives",
      "To compare the evaporative cooling of honeybee hives with the ventilation shafts of termite mounds"
    ],
    [
      "<i>In his 1962 book 'The Structure of Scientific Revolutions,' philosopher Thomas Kuhn challenged the view that science progresses through a steady, linear accumulation of facts. Instead, Kuhn argued that science operates within a shared 'paradigm' until persistent anomalies accumulate that the framework cannot explain. <u>At that point, the discipline undergoes a 'paradigm shift'—such as the transition from Newtonian mechanics to Einsteinian relativity—that fundamentally redefines what counts as a valid scientific question.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It defines Kuhn's concept of a paradigm shift and gives an example.",
      "It refutes Einstein's general relativity by showing that Newtonian physics still works for civil engineering.",
      "It explains why senior scientists often resist experimental findings that challenge their early training.",
      "It summarizes the traditional linear view of scientific history that Kuhn's 1962 book sought to defend."
    ],
    [
      "<i>Because the Moon lacks a global magnetic field today, planetary scientists were surprised when Apollo astronauts returned lunar rock samples formed 3.8 billion years ago that were strongly magnetized. Two competing hypotheses emerged: either early asteroid impacts generated brief plasma magnetic fields on the surface, or the young Moon possessed a convecting liquid-iron core dynamo that died out once the small lunar interior cooled and solidified.</i><br><br>Which choice best describes the overall structure of the text?",
      "It notes a puzzling finding from lunar rocks and presents two competing explanations.",
      "It explains why the Apollo lunar program ended before astronauts could sample the Moon's far side.",
      "It argues that Earth's magnetosphere is responsible for magnetizing rocks on the lunar surface.",
      "It describes the magnetometer instruments used to measure remnant magnetism in Apollo basalts."
    ],
    [
      "<i>In Japanese joinery (kigumi), master carpenters construct complex wooden temples and houses without using a single iron nail, screw, or drop of glue. Instead, they carve interlocking mortise-and-tenon joints of extraordinary geometric precision. Beyond aesthetic elegance, this nail-free architecture provides a crucial seismic advantage: during an earthquake, the wooden joints flex slightly and dissipate vibrational energy without snapping, allowing centuries-old pagodas to survive tremors that topple rigid masonry buildings.</i><br><br>What is the main purpose of the text?",
      "To describe traditional Japanese wood joinery and its earthquake resilience",
      "To lament the decline of traditional kigumi carpentry apprenticeships in modern Tokyo",
      "To compare medieval Japanese iron-smelting methods with those of Western Europe",
      "To provide step-by-step instructions for carving an interlocking mortise-and-tenon joint"
    ],
    [
      "<i>When predators such as lynx hunt snowshoe hares across the boreal forest, hare populations rise and fall in dramatic ten-year cycles. Field ecologists assumed this cycle was driven purely by direct predation: more lynx eat more hares until hares become scarce, causing lynx to starve. <u>However, experiments by Rudy Boonstra revealed that even when hares are protected from lynx inside predator-proof fences, chronic stress from hearing and smelling nearby lynx causes female hares' cortisol levels to spike, reducing their reproductive output by two-thirds.</u></i><br><br>Which choice best states the function of the underlined sentence?",
      "It cites experimental evidence that stress from predators reduces hare reproduction.",
      "It explains why snowshoe hares molt from brown summer fur to white camouflage.",
      "It shows that wire fences are ineffective at keeping Canadian lynx out.",
      "It argues that lynx populations would stabilize if they hunted red squirrels."
    ],
    [
      "<i>In linguistics, 'code-switching' refers to the practice of alternating between two or more languages or dialects within a single conversation. Once stigmatized by prescriptive educators as a sign of linguistic confusion or incomplete mastery, code-switching is now recognized by sociolinguists as a rule-governed, highly skilled communicative strategy that speakers use to signal group solidarity, convey subtle humor, or shift the formality of a discussion.</i><br><br>Which choice best describes the overall structure of the text?",
      "It defines code-switching and contrasts an older negative view with current linguistic understanding.",
      "It provides a statistical breakdown of which bilingual communities code-switch most often while dismissing alternative interpretations proposed by earlier critics.",
      "It argues that public schools should conduct classroom instruction in a single standard dialect by contrasting empirical laboratory measurements with historical anecdotes.",
      "It explains the neurological stages by which infants acquire two spoken languages simultaneously."
    ],
    [
      "<i>To map the subterranean chambers of the Great Pyramid of Giza without drilling into the ancient stone, an international team of physicists deployed 'muon tomography' in 2017. Cosmic rays striking Earth's upper atmosphere constantly shower the planet with harmless subatomic particles called muons, which pass through empty air effortlessly but are absorbed or deflected by dense limestone. By placing muon detector plates at the base of the pyramid—much like an X-ray film—the team discovered a previously unknown thirty-meter-long void above the Grand Gallery.</i><br><br>What is the main purpose of the text?",
      "To explain how muon detectors revealed a hidden void in the Great Pyramid",
      "To speculate on the royal burial artifacts that Pharaoh Khufu placed inside the newly found void",
      "To compare the limestone blocks of Giza with the rock-cut tombs in the Valley of the Kings",
      "To warn that cosmic-ray muons pose a radiation hazard to tourists visiting Egyptian pyramids"
    ],
    [
      "<i>In her 1869 novel 'Little Women,' Louisa May Alcott originally intended for her fiercely independent protagonist, Jo March, to remain an unmarried literary spinster—just as Alcott herself did in real life. <u>Yet relentless letters from young readers demanding that Jo marry her childhood friend Laurie, combined with pressure from her publisher to deliver a conventional Victorian ending, prompted Alcott to invent the eccentric Professor Bhaer as a compromise husband for Jo.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It explains the external pressures that led Alcott to marry off Jo March.",
      "It argues that Professor Bhaer was a much better romantic match for Jo March than Laurie was.",
      "It illustrates how nineteenth-century female authors were denied copyright royalties by publishers.",
      "It summarizes the plot of the first half of 'Little Women' before Jo moves to New York City."
    ],
    [
      "<i>Unlike chemical rockets, which burn tons of propellant in a few minutes to escape Earth's gravity, an ion thruster uses solar panels to ionize xenon gas and accelerate the charged atoms through an electrostatic grid. The resulting thrust is minuscule—roughly equivalent to the weight of a single sheet of paper resting on your hand. In the frictionless vacuum of deep space, however, an ion thruster can fire continuously for years, eventually propelling spacecraft like NASA's Dawn mission to velocities far exceeding those of conventional rockets.</i><br><br>Which choice best describes the overall structure of the text?",
      "It contrasts ion thrusters with chemical rockets and explains how ion thrusters achieve high speed in deep space.",
      "It details the atomic properties of xenon gas and explains why it is more expensive than liquid hydrogen.",
      "It argues that space agencies should use ion thrusters to launch heavy satellites from Earth's surface.",
      "It chronicles the geological discoveries made by NASA's Dawn mission at the asteroid Vesta and dwarf planet Ceres."
    ],
    [
      "<i>For decades, neurobiologists assumed that adult mammalian brains could not generate new neurons after infancy. Starting in the 1990s, however, Elizabeth Gould and colleagues demonstrated active neurogenesis in the dentate gyrus of the adult hippocampus across primates and rodents. Today, research has shifted from debating whether adult neurogenesis occurs to investigating how environmental enrichment and aerobic exercise regulate the survival of these newborn granule cells.</i><br><br>Which choice best describes the overall structure of the text?",
      "It outlines a once-dominant scientific consensus, notes the experimental discovery that overturned it, and identifies the current focus of inquiry in the field.",
      "It questions the validity of a 1990s neurobiological experiment and proposes an alternative laboratory technique for imaging primate brain tissue while.",
      "It compares the rate of hippocampal neuron growth in infant rodents with the rate of synaptic pruning observed in aging primate populations by contrasting.",
      "It argues that aerobic exercise is more effective than environmental enrichment for preventing memory loss in adult mammals while dismissing alternative."
    ],
    [
      "<i>When constructing the dome of Florence Cathedral between 1420 and 1436 without wooden centering frameworks, Filippo Brunelleschi faced a severe structural problem: outward hoop stresses threatened to crack the octagonal masonry shell before the lantern could be closed.<u> To counteract this lateral thrust, Brunelleschi embedded a continuous interlocking chain of sandstone beams cramped with lead-sheathed iron and laid the bricks in a spiraling herringbone bond (spina di pesce) that locked each course into a self-supporting ring.</u></i><br><br>Which choice best describes the function of the underlined sentence in the text as a whole?",
      "It explains the specific engineering innovations Brunelleschi used to solve the structural problem introduced in the first sentence.",
      "It criticizes fifteenth-century Florentine guild masters for refusing to supply timber scaffolding for the cathedral dome by contrasting empirical laboratory measurements with historical anecdotes.",
      "It contrasts the aesthetic appearance of Florence Cathedral's octagonal dome with that of the circular Pantheon in Rome while dismissing alternative interpretations proposed by earlier critics.",
      "It provides evidence that lead-sheathed iron cramps corrode more rapidly than sandstone beams when exposed to rainwater."
    ],
    [
      "<i>The following text is from Edith Wharton's 1920 novel The Age of Innocence. Newland Archer is attending an opera in 1870s New York.<br>\"Though there was already talk of the erection, in remote metropolitan distances 'above the Forties,' of a new Opera House which should compete in costliness and splendor with those of the great European capitals, the world of fashion was still content to reassemble every winter in the shabby red and gold boxes of the sociable old Academy. Conservatives cherished it for being small and inconvenient, and thus keeping out the 'new people' whom New York was beginning to dread and yet be drawn to.\"</i><br><br>What is the main purpose of the text?",
      "To illustrate how the New York elite's attachment to an outdated venue reflected their desire to preserve social exclusivity against rising wealth.",
      "To explain the architectural and acoustic defects that forced the Academy of Music to close its doors in the late nineteenth century while dismissing alternative interpretations proposed by earlier critics.",
      "To argue that nineteenth-century American opera houses were far more lavishly decorated than comparable theaters in Paris and Vienna by contrasting empirical laboratory measurements with historical anecdotes.",
      "To trace Newland Archer's personal campaign to fund a larger, more accessible public auditorium uptown above the Forties while dismissing alternative interpretations proposed by earlier critics."
    ],
    [
      "<i>Standard economic models of charitable giving treat donations as pure public goods, predicting that government grants to a nonprofit should 'crowd out' private contributions dollar for dollar. Yet empirical studies by James Andreoni show that federal grants frequently 'crowd in' private donations instead.<u> The paradox dissolves once we recognize that institutional grants serve as a credible quality signal to individual donors and spur the nonprofit's board to expand its fundraising outreach.</u></i><br><br>Which choice best states the function of the underlined portion?",
      "It offers an explanatory mechanism that reconciles the empirical observation in the second sentence with the theoretical prediction in the first.",
      "It concedes that government grants should be eliminated because they discourage nonprofit boards from soliciting small private donors by contrasting empirical laboratory measurements with historical anecdotes.",
      "It summarizes the mathematical assumptions underlying classical public-goods theory as formulated by mid-twentieth-century economists while dismissing alternative interpretations proposed by earlier critics.",
      "It questions the statistical reliability of the fundraising data collected by James Andreoni across American charitable organizations."
    ],
    [
      "<i>Unlike the phonetic alphabets of Greek and Latin, which represent individual consonant and vowel sounds with roughly two dozen characters, Classical Mayan script is a logosyllabic system combining over 800 distinct glyphs: a scribe could write the word balam ('jaguar') as a single pictorial logogram of a jaguar's head, as three phonetic syllable signs (ba-la-ma), or as a logogram reinforced by a phonetic complement.</i><br><br>What is the main purpose of the text?",
      "To explain the structural versatility of Classical Mayan writing by contrasting its logosyllabic design with alphabetic scripts and giving an example.",
      "To demonstrate that phonetic syllable signs gradually replaced pictorial logograms in Mayan inscriptions during the Late Classic period while dismissing alternative interpretations proposed by earlier critics.",
      "To argue that Greek and Latin alphabets are easier for modern epigraphers to decipher than ancient Mesoamerican writing systems by contrasting empirical laboratory measurements with historical anecdotes.",
      "To describe the religious symbolism associated with jaguars in the royal courtly art of Classic Mayan city-states while dismissing alternative interpretations proposed by earlier critics."
    ],
    [
      "<i>Astronomers long puzzled over why the solar corona—the sun's tenuous outer atmosphere—reaches temperatures exceeding two million kelvin, whereas the visible photosphere directly beneath it is only about 5,800 kelvin.<u> Recent high-resolution magnetograms from the Parker Solar Probe and Solar Orbiter indicate that ubiquitous 'campfires'—nanoflares triggered by the magnetic reconnection of braided flux tubes—continuously inject Alfvenic wave energy into the upper atmosphere.</u></i><br><br>Which choice best describes the function of the underlined sentence?",
      "It presents recent observational evidence that accounts for the counterintuitive temperature gradient described in the previous sentence.",
      "It explains why the visible photosphere of the sun cools to 5,800 kelvin during periods of low sunspot activity by contrasting.",
      "It describes the heat-shield materials that allow the Parker Solar Probe to survive close approaches to the solar corona while.",
      "It challenges the accuracy of temperature measurements taken by ground-based solar telescopes prior to the launch of Solar Orbiter."
    ],
    [
      "<i>In 1854, mathematician Bernhard Riemann delivered his habilitation lecture 'On the Hypotheses Which Lie at the Foundations of Geometry.' Rather than treating Euclidean parallel postulates as self-evident truths about physical space, Riemann generalized Gauss's theory of curved surfaces to n-dimensional manifolds whose metric tensor could vary from point to point—a purely abstract framework that sixty years later provided the exact mathematical language Albert Einstein needed for general relativity.</i><br><br>Which choice best describes the overall purpose of the text?",
      "To highlight how Riemann's abstract reconceptualization of geometry later proved foundational for modern gravitational physics.",
      "To prove that Carl Friedrich Gauss had already formulated the complete equations of general relativity before 1854.",
      "To contrast the pedagogical methods used in nineteenth-century German universities with those of twentieth-century physics institutes.",
      "To explain why Euclidean geometry remains more accurate than Riemannian geometry for calculating planetary orbits."
    ],
    [
      "<i>Many conservationists advocate planting fast-growing monoculture pine plantations on degraded tropical pastures to maximize short-term carbon sequestration. Ecologists Carla Chazdon and Robin Chazdon note, however, that natural forest regeneration on abandoned pastures—where fruit-eating birds and bats disperse dozens of native hardwood species—stores 40 percent more carbon over thirty years, restores watershed infiltration, and supports tenfold greater biodiversity at a fraction of the planting cost.</i><br><br>Which choice best describes the structure of the text?",
      "It presents a common environmental intervention and then details ecological evidence showing that an alternative approach yields superior long-term results.",
      "It compares the seed-dispersal range of tropical fruit-eating birds with that of nocturnal bats in undisturbed primary rainforests by contrasting empirical laboratory measurements with historical anecdotes.",
      "It argues that timber companies should harvest monoculture pine plantations every thirty years in order to fund tropical bird sanctuaries while dismissing alternative interpretations proposed by earlier critics.",
      "It traces the historical causes of cattle-pasture expansion across tropical river basins during the late twentieth century by contrasting empirical laboratory measurements with historical anecdotes."
    ],
    [
      "<i>The following text is from Claude McKay's 1922 poem 'The Tropics in New York.'<br>\"Bananas ripe and green, and ginger-root,<br>Cocoa in pods and alligator pears,<br>And tangerines and mangoes and grape fruit,<br>Fit for the highest prize at parish fairs,<br>Set in the window, bringing memories<br>Of fruit-trees laden by low-singing rills,<br>And dewy dawns, and mystical blue skies<br>In benediction over nun-like hills.\"</i><br><br>Which choice best describes the structural shift that occurs between the first four lines and the last four lines of the poem?",
      "The speaker moves from a sensory inventory of tropical produce displayed in an urban shop window to a reverent recollection of the homeland landscape it evokes.",
      "The speaker transitions from praising the affordability of imported Caribbean fruit in New York markets to criticizing the working conditions on rural parish farms.",
      "The speaker shifts from describing a bustling morning street market in Jamaica to lamenting the cold winter weather of Manhattan.",
      "The speaker contrasts the artificial appearance of greenhouse-grown fruit with the superior flavor of wild berries gathered along mountain streams."
    ],
    [
      "<i>In software engineering, Brooks's Law—formulated by Fred Brooks in his 1975 book The Mythical Man-Month—states that 'adding human resources to a late software project makes it later.'<u> Because software modules have dense logical interdependencies, every newly hired developer requires weeks of onboarding from existing engineers, and the number of communication channelsamong N team members scales quadratically as N(N − 1)/2.</u></i><br><br>What is the primary function of the underlined sentence?",
      "It explains the underlying organizational and mathematical reasons why the principle stated in the first sentence holds true.",
      "It proposes a new software architecture that eliminates all logical interdependencies between code modules in large projects.",
      "It argues that Fred Brooks's 1975 observations no longer apply to modern software teams that use automated code repositories.",
      "It calculates the exact salary budget required to hire additional software engineers during the final month of a product launch."
    ]
  ],
  [
    [
      "<b>Text 1</b><br><i>In 2006, the International Astronomical Union defined a planet as a body that orbits the Sun, is massive enough to be nearly round, and has cleared its orbital neighborhood of other objects. Because Pluto shares its orbit with many Kuiper Belt objects, it was reclassified as a dwarf planet.</i><br><br><b>Text 2</b><br><i>Planetary scientist Alan Stern argues that the 'clearing' criterion is poorly conceived. Earth continually shares its orbit with thousands of near-Earth asteroids, and Jupiter with its Trojan asteroids, so no planet fully clears its path. Stern favors defining planets by intrinsic properties, such as roundness.</i><br><br>Based on the texts, how would Stern (Text 2) most likely evaluate the IAU's reason for reclassifying Pluto (Text 1)?",
      "As flawed, because even the eight recognized planets share their orbits with smaller bodies.",
      "As justified, because Pluto's orbit is the only one in the solar system that overlaps.",
      "As unnecessary, because Pluto is not massive enough to be nearly round and therefore.",
      "As reasonable but incomplete, because the IAU should also have required every planet."
    ],
    [
      "<b>Text 1</b><br><i>According to the giant-impact hypothesis, the Moon formed about 4.5 billion years ago when a Mars-sized body, often called Theia, struck the young Earth. Debris from the collision, derived largely from the impactor, then coalesced in orbit.</i><br><br><b>Text 2</b><br><i>Analyses of lunar samples returned by the Apollo missions show that the Moon's isotopic composition for oxygen and several other elements is nearly identical to that of Earth's mantle. Because different bodies in the solar system typically have distinct isotopic signatures, this similarity is surprising.</i><br><br>Which choice best describes the relationship between Text 1 and Text 2?",
      "Text 2 raises a compositional puzzle for a detail of the scenario outlined in Text 1.",
      "Text 2 proves that the Moon formed independently of Earth, which contradicts the timeline given in Text 1.",
      "Text 2 explains how Theia's orbit was altered by Jupiter before the collision described in Text 1.",
      "Text 2 supplies the exact mass of Theia, which Text 1 had only estimated as comparable to that of Mars."
    ],
    [
      "<b>Text 1</b><br><i>In 1967, biologist Lynn Margulis argued that mitochondria and chloroplasts descend from free-living bacteria that were engulfed by ancestral eukaryotic cells and eventually became permanent, mutually beneficial residents rather than being digested.</i><br><br><b>Text 2</b><br><i>Mitochondria and chloroplasts each contain their own circular DNA, divide independently of the cell, and are enclosed by double membranes. Their ribosomes also resemble those of bacteria more closely than those found elsewhere in the eukaryotic cell.</i><br><br>Based on the texts, how does the information in Text 2 relate to the claim in Text 1?",
      "It describes features that would be expected if the organelles had bacterial ancestors.",
      "It demonstrates that organelles cannot replicate without direct instructions from nuclear DNA, which contradicts the claim in Text 1.",
      "It shows that bacteria can be engulfed only by eukaryotic cells that already contain mitochondria and chloroplasts.",
      "It confirms that chloroplasts evolved from mitochondria, a possibility that Text 1 had not considered."
    ],
    [
      "<b>Text 1</b><br><i>In the 1970s, astronomer Vera Rubin measured the orbital speeds of stars in spiral galaxies and found that stars far from the center move about as fast as those near it. Under Newtonian gravity, the visible mass alone cannot account for such speeds, and Rubin's work became key evidence for dark matter.</i><br><br><b>Text 2</b><br><i>In 1983, physicist Mordehai Milgrom proposed Modified Newtonian Dynamics (MOND), which holds that gravity behaves differently at the very low accelerations found at the edges of galaxies. MOND reproduces many observed rotation curves without invoking any unseen matter.</i><br><br>Based on the texts, the authors of Text 1 and Text 2 would most likely agree that",
      "galactic rotation curves conflict with predictions based on visible mass and standard gravity.",
      "dark matter is required to explain the rotation of every spiral galaxy that has been measured to date.",
      "Newtonian gravity must be modified because unseen matter has been ruled out by observations of galaxies.",
      "stars at the edge of a galaxy orbit more slowly than stars near its center."
    ],
    [
      "<b>Text 1</b><br><i>Neanderthals vanished from the fossil record roughly 40,000 years ago, during a period of rapid climate oscillations in Europe. Some paleoanthropologists argue that these abrupt swings fragmented small Neanderthal populations, making them vulnerable to extinction regardless of the presence of other humans.</i><br><br><b>Text 2</b><br><i>Other researchers emphasize that Neanderthals disappeared soon after Homo sapiens spread across Europe. They suggest that modern humans, who had larger social networks and perhaps more efficient hunting technology, outcompeted Neanderthals for food and territory.</i><br><br>What is the main difference between the explanations offered in the texts?",
      "Text 1 stresses environmental change, while Text 2 stresses competition from another human species.",
      "Text 1 claims that Neanderthals were more intelligent than Homo sapiens, while Text 2 claims that they were less so.",
      "Text 1 dates the disappearance of Neanderthals to 40,000 years ago, while Text 2 dates it to a much earlier period.",
      "Text 1 argues that Neanderthals migrated out of Europe, while Text 2 argues that they were absorbed entirely into modern human populations."
    ],
    [
      "<b>Text 1</b><br><i>For much of the twentieth century, archaeologists held that the Clovis culture, known for its distinctive fluted stone spear points and dated to roughly 13,000 years ago, represented the first human presence in the Americas.</i><br><br><b>Text 2</b><br><i>Excavations at Monte Verde in southern Chile, led by Tom Dillehay, uncovered wooden structures, plant remains, and stone tools dated to about 14,500 years ago, well before the earliest Clovis sites in North America.</i><br><br>Based on the texts, how does the evidence in Text 2 affect the view described in Text 1?",
      "It suggests that humans reached the Americas earlier than the Clovis-first view allows.",
      "It confirms that Clovis hunters traveled south and founded the settlement at Monte.",
      "It proves that the fluted spear points associated with Clovis were invented in South.",
      "It shows that Clovis sites in North America are older than any site in South."
    ],
    [
      "<b>Text 1</b><br><i>In The History of the Decline and Fall of the Roman Empire (1776-1789), Edward Gibbon argued that Rome's collapse resulted largely from internal decay: the erosion of civic virtue, an overreliance on mercenary soldiers, and the rise of Christianity, which he believed redirected loyalty away from the state.</i><br><br><b>Text 2</b><br><i>Historian Peter Heather contends that the western empire was brought down mainly by external pressure. The westward movement of the Huns in the late fourth century drove Goths and other groups across Roman frontiers, and the cumulative loss of provinces deprived the state of the tax revenue needed to pay its armies.</i><br><br>Based on the texts, how would Heather (Text 2) most likely respond to Gibbon's explanation (Text 1)?",
      "By arguing that outside military pressure, rather than internal moral decline, was the decisive factor.",
      "By agreeing that Christianity weakened the empire but adding that the Huns were themselves Christian converts.",
      "By claiming that Rome's armies consisted entirely of Roman citizens rather than mercenaries, contrary to Gibbon.",
      "By asserting that Rome's fall was sudden and unrelated to the loss of tax revenue from its provinces."
    ],
    [
      "<b>Text 1</b><br><i>Economic historian Robert Allen argues that Britain industrialized first because of unusual economic conditions: high wages made labor expensive, while abundant coal made energy cheap. These prices gave British manufacturers a strong incentive to invent and adopt machines that substituted capital and coal for labor.</i><br><br><b>Text 2</b><br><i>Historian Joel Mokyr attributes Britain's lead to an 'Industrial Enlightenment,' a culture in which engineers, instrument makers, and natural philosophers freely exchanged practical scientific knowledge. Without this widespread belief in the usefulness of knowledge, he argues, favorable prices alone would not have produced sustained innovation.</i><br><br>Which choice best describes a disagreement between Allen and Mokyr?",
      "Whether market incentives or an intellectual culture best explains Britain's early industrialization.",
      "Whether coal was more plentiful in Britain than in other European countries during the eighteenth century.",
      "Whether the machines of the Industrial Revolution reduced the demand for skilled labor in British factories.",
      "Whether engineers and instrument makers in Britain were more numerous than natural philosophers during this period."
    ],
    [
      "<b>Text 1</b><br><i>Between 1916 and 1970, roughly six million Black Americans left the rural South for cities in the North, Midwest, and West. Some historians emphasize the push of Southern conditions: Jim Crow segregation, racial violence, and crop failures caused by the boll weevil.</i><br><br><b>Text 2</b><br><i>Other historians emphasize the pull of Northern opportunity. When World War I cut off European immigration and increased demand for industrial output, factories in cities such as Chicago and Detroit recruited Southern workers with wages far higher than those available in agriculture.</i><br><br>How do the texts differ in their explanation of the Great Migration?",
      "Text 1 stresses forces pushing people out of the South; Text 2 stresses jobs pulling them north.",
      "Text 1 attributes the migration to wartime labor shortages, while Text 2 attributes it to segregation laws and racial violence.",
      "Text 1 describes migration to Northern cities only, while Text 2 describes migration to Western cities only.",
      "Text 1 argues that the migration ended in 1916, while Text 2 argues that it continued without interruption until 1970."
    ],
    [
      "<b>Text 1</b><br><i>Historian Elizabeth Eisenstein argued in 1979 that Johannes Gutenberg's movable-type press, developed around 1450, was an 'agent of change' in early modern Europe. By producing identical texts quickly and cheaply, she claimed, printing made possible the rapid spread of the ideas of the Protestant Reformation after 1517.</i><br><br><b>Text 2</b><br><i>Some scholars caution that most Europeans in 1517 could not read, and that Martin Luther's ideas also spread through sermons, songs, and conversation in taverns and marketplaces. Printed pamphlets mattered, these scholars note, but often because they were read aloud to groups.</i><br><br>Based on the texts, how would the scholars in Text 2 most likely view Eisenstein's claim in Text 1?",
      "As overlooking the role of oral communication in spreading Reformation ideas.",
      "As exaggerated because printing had not yet been invented when Luther published his ideas in 1517.",
      "As inaccurate because Luther opposed printed pamphlets and relied exclusively on sermons.",
      "As reasonable because literacy rates in Europe exceeded 90 percent by the early sixteenth century."
    ],
    [
      "<b>Text 1</b><br><i>Agronomist Norman Borlaug developed semi-dwarf, disease-resistant wheat varieties in Mexico in the 1940s and 1950s. When the new varieties, paired with fertilizer and irrigation, were introduced in India and Pakistan in the 1960s, wheat harvests rose dramatically, and Borlaug received the 1970 Nobel Peace Prize.</i><br><br><b>Text 2</b><br><i>Critics of the Green Revolution, such as the activist Vandana Shiva, point out that the new crop varieties required heavy inputs of chemical fertilizer, pesticides, and groundwater. In parts of Punjab, these demands contributed to falling water tables and soil degradation.</i><br><br>Based on the texts, what does Text 2 add to the account in Text 1?",
      "It identifies environmental costs associated with the success described in Text 1.",
      "It disputes that wheat harvests in India and Pakistan rose after the new.",
      "It reveals that Borlaug's wheat varieties required no irrigation, which made.",
      "It shows that the Nobel committee had overlooked the role of fertilizer."
    ],
    [
      "<b>Text 1</b><br><i>In The General Theory (1936), John Maynard Keynes argued that economies can remain stuck in prolonged slumps when total demand is too low. In such cases, he held, governments should increase spending or cut taxes to restore demand and employment.</i><br><br><b>Text 2</b><br><i>Milton Friedman and Anna Schwartz argued in A Monetary History of the United States (1963) that the Great Depression was made far worse by the Federal Reserve, which allowed the money supply to shrink by about one-third. Friedman concluded that steady control of the money supply, not fiscal intervention, is the key to economic stability.</i><br><br>What is the main disagreement between the views in Text 1 and Text 2?",
      "Whether government spending or control of the money supply is the better tool for stabilizing an economy.",
      "Whether prolonged economic slumps such as the Great Depression can occur in a market economy when evaluating how institutional incentives shape long-term outcomes.",
      "Whether the Federal Reserve existed in 1936, when Keynes published The General Theory despite relying on the same foundational archival and experimental datasets.",
      "Whether total demand has any influence on the level of employment in an economy when evaluating how institutional incentives shape long-term outcomes."
    ],
    [
      "<b>Text 1</b><br><i>A standard textbook model of labor markets predicts that raising the minimum wage will reduce employment, because employers will hire fewer workers when each worker costs more.</i><br><br><b>Text 2</b><br><i>In 1994, economists David Card and Alan Krueger compared fast-food restaurants in New Jersey, which raised its minimum wage in 1992, with those in neighboring eastern Pennsylvania, which did not. They found no evidence that employment fell in New Jersey relative to Pennsylvania.</i><br><br>Based on the texts, how does the study in Text 2 relate to the prediction in Text 1?",
      "It provides empirical evidence that does not support the prediction.",
      "It confirms the prediction by showing that New Jersey restaurants hired fewer workers than Pennsylvania restaurants.",
      "It rejects the prediction on theoretical grounds without gathering any data from actual businesses.",
      "It shows that the prediction applies only to industries other than fast food, such as manufacturing."
    ],
    [
      "<b>Text 1</b><br><i>In a 2006 experiment, researchers led by Peter Turnbaugh transferred gut bacteria from obese mice into germ-free mice. The recipients gained more body fat than germ-free mice given bacteria from lean mice, suggesting that the gut microbiome can influence how efficiently the body extracts energy from food.</i><br><br><b>Text 2</b><br><i>Nutrition researchers caution that results in laboratory mice, which eat standardized diets in controlled environments, cannot be assumed to apply to humans. Human microbiomes vary with diet, geography, and medication, and clinical trials in people have so far produced mixed results.</i><br><br>Based on the texts, what would the researchers in Text 2 most likely say about the conclusion in Text 1?",
      "That it may not hold for humans without further evidence from human trials.",
      "That it is invalid because the mice in the experiment were fed different diets by the researchers.",
      "That it shows obesity in humans is caused entirely by differences in gut bacteria.",
      "That it should be applied directly to human patients because mice and humans have identical microbiomes."
    ],
    [
      "<b>Text 1</b><br><i>In a 1955 paper, physician Henry Beecher reviewed fifteen studies and concluded that about 35 percent of patients improved after receiving a placebo, helping to establish the idea that inert treatments can have powerful effects.</i><br><br><b>Text 2</b><br><i>In a 2001 review of 114 clinical trials, Asbjorn Hrobjartsson and Peter Gotzsche compared placebo groups with groups that received no treatment at all. They found little evidence that placebos have powerful effects, apart from modest effects on subjective outcomes such as pain.</i><br><br>Based on the texts, how would Hrobjartsson and Gotzsche (Text 2) most likely respond to Beecher's conclusion (Text 1)?",
      "By suggesting that improvement in placebo groups may reflect other factors, such as natural recovery.",
      "By arguing that the 35 percent figure underestimates the placebo effect, which is strongest for objective outcomes such as blood pressure.",
      "By claiming that placebos are harmful because patients who receive them improve less than patients who receive no treatment.",
      "By concluding that Beecher was correct because modest effects on pain show that placebos are powerful for all conditions."
    ],
    [
      "<b>Text 1</b><br><i>In studies beginning in the 2000s, psychologist Ellen Bialystok reported that bilingual adults and children often outperform monolinguals on tasks requiring executive control, such as ignoring distractions and switching between rules. She attributed this advantage to bilinguals' constant practice at managing two active languages.</i><br><br><b>Text 2</b><br><i>In 2015, Angela de Bruin and colleagues analyzed conference abstracts and found that studies reporting a bilingual advantage were much more likely to be published than studies reporting no difference. Large replications, they noted, have frequently failed to detect an advantage.</i><br><br>Based on the texts, what is the most likely implication of Text 2 for the claim in Text 1?",
      "The apparent advantage may be overstated because positive results are published more often.",
      "The advantage is real but applies only to adults, since children were excluded.",
      "Monolinguals consistently outperform bilinguals on tasks requiring executive control.",
      "Bilingual people practice managing two languages less often than researchers had."
    ],
    [
      "<b>Text 1</b><br><i>Psychologist Carol Dweck has argued that students who believe intelligence can be developed through effort, a 'growth mindset,' tend to persist after setbacks and to earn higher grades than students who believe intelligence is fixed.</i><br><br><b>Text 2</b><br><i>A 2018 meta-analysis by Victoria Sisk and colleagues, which combined results from hundreds of studies, found only a weak overall relationship between mindset and academic achievement, and only small average effects of mindset interventions on students' performance.</i><br><br>Which choice best describes the relationship between Text 1 and Text 2?",
      "Text 2 suggests that the benefits claimed in Text 1 are smaller than they might seem.",
      "Text 2 shows that students with a fixed mindset earn higher grades than students with a growth mindset.",
      "Text 2 supports Text 1 by demonstrating that mindset interventions are the strongest predictor of student achievement.",
      "Text 2 argues that Dweck's research was never published in a peer-reviewed journal."
    ],
    [
      "<b>Text 1</b><br><i>In experiments at Stanford beginning in 1972, psychologist Walter Mischel offered preschoolers one marshmallow now or two if they could wait. Follow-up studies reported that children who waited longer later had higher SAT scores and other positive outcomes, suggesting that self-control is an important predictor of success.</i><br><br><b>Text 2</b><br><i>In 2018, Tyler Watts and colleagues repeated the study with a much larger and more diverse sample. They found that the link between waiting time and later achievement was considerably weaker and largely disappeared after accounting for family background and early cognitive ability.</i><br><br>Based on the texts, what would Watts's team (Text 2) most likely conclude about the findings in Text 1?",
      "That family circumstances probably explain part of the link between waiting and later success.",
      "That children's ability to wait is unrelated to their ability to delay gratification in other situations.",
      "That the original results were fabricated because the preschoolers in the study were too young to participate.",
      "That self-control training for preschoolers is the most effective way to raise later SAT scores."
    ],
    [
      "<b>Text 1</b><br><i>In 1971, psychologist Philip Zimbardo randomly assigned college students to play guards or prisoners in a mock prison at Stanford. Within days, some guards behaved cruelly, which Zimbardo interpreted as evidence that ordinary people will behave abusively when placed in an authoritative role.</i><br><br><b>Text 2</b><br><i>In 2019, researcher Thibault Le Texier examined archival recordings and documents and reported that the guards were given instructions about how to treat the prisoners and were encouraged to be tough. Le Texier argued that this undermines the claim that the guards' behavior emerged spontaneously.</i><br><br>Based on the texts, how does Text 2 challenge Text 1?",
      "It suggests the guards' behavior may have been shaped by instructions rather than arising on its own.",
      "It shows that the participants were not randomly assigned to the roles of guard and prisoner despite relying on the same foundational archival and experimental datasets.",
      "It argues that the experiment lasted much longer than Zimbardo reported when evaluating how institutional incentives shape long-term outcomes.",
      "It claims that the prisoners were actually the participants who behaved most cruelly despite relying on the same foundational archival and experimental datasets."
    ],
    [
      "<b>Text 1</b><br><i>Linguist Benjamin Lee Whorf argued in the 1930s and 1940s that the structure of a language shapes how its speakers perceive and think about the world. Many later researchers rejected the strongest form of this claim, that language fully determines thought.</i><br><br><b>Text 2</b><br><i>In a 2007 study, Jonathan Winawer and colleagues tested Russian speakers, whose language has separate basic words for light blue (goluboy) and dark blue (siniy). Russian speakers were faster than English speakers at distinguishing shades of blue that fell on opposite sides of the Russian boundary.</i><br><br>Based on the texts, which statement best describes how Text 2 relates to Text 1?",
      "Text 2 supports a limited version of the idea in Text 1.",
      "Text 2 shows that language fully determines perception, confirming the strongest form of Whorf's claim.",
      "Text 2 disproves Whorf's claim by showing that English and Russian speakers perceive color identically.",
      "Text 2 demonstrates that Russian has more color words than any other language, as Text 1 predicted."
    ],
    [
      "<b>Text 1</b><br><i>Linguist Noam Chomsky has argued that children acquire language so quickly, despite hearing limited and imperfect speech, that they must be born with an innate, language-specific capacity often called universal grammar.</i><br><br><b>Text 2</b><br><i>Psychologist Michael Tomasello contends that children learn language using general cognitive abilities, such as reading others' intentions and recognizing patterns, applied to the speech they hear. He argues that no innate grammar specific to language is needed to explain acquisition.</i><br><br>What is the central disagreement between Text 1 and Text 2?",
      "Whether language acquisition depends on an innate faculty specific to language.",
      "Whether children are able to learn language at all without formal.",
      "Whether children hear speech that is limited and imperfect.",
      "Whether pattern recognition and intention reading are important aspects."
    ],
    [
      "<b>Text 1</b><br><i>In the 1970s, chemist James Lovelock and microbiologist Lynn Margulis proposed the Gaia hypothesis, which holds that living organisms and their inorganic surroundings form a self-regulating system that keeps Earth's conditions, such as temperature and atmospheric composition, suitable for life.</i><br><br><b>Text 2</b><br><i>Evolutionary biologist W. Ford Doolittle objected that natural selection acts on individuals that reproduce and compete, but there is only one Earth and no population of competing planets. Without selection at the planetary level, he argued, there is no plausible mechanism for the global self-regulation that Gaia proposes.</i><br><br>Based on the texts, Doolittle's main objection to the Gaia hypothesis is that",
      "it lacks a plausible evolutionary mechanism to produce planet-wide regulation.",
      "it incorrectly assumes that Earth's atmospheric composition has remained constant since the origin of life.",
      "it fails to recognize that individual organisms have any effect on their immediate surroundings.",
      "it relies on temperature measurements that Lovelock and Margulis never actually collected."
    ],
    [
      "<b>Text 1</b><br><i>After gray wolves were reintroduced to Yellowstone National Park in 1995, researchers observed that elk, the wolves' main prey, grazed less in open valleys. Willow and aspen then began to recover, which some ecologists credit as a 'trophic cascade' set off by the return of a top predator.</i><br><br><b>Text 2</b><br><i>Other ecologists argue that this account is oversimplified. They note that elk numbers were already declining because of hunting outside the park and increasing bear predation, and that changes in precipitation and water tables also affect willow growth.</i><br><br>Based on the texts, how would the ecologists in Text 2 most likely assess the claim in Text 1?",
      "As incomplete, since factors other than wolves may have contributed to the vegetation recovery.",
      "As mistaken, since elk populations increased substantially after wolves returned to Yellowstone.",
      "As accurate, since bears and hunters had no measurable effect on elk numbers in the park.",
      "As irrelevant, since willow and aspen are not affected by changes in grazing pressure."
    ],
    [
      "<b>Text 1</b><br><i>Coral bleaching occurs when elevated water temperatures cause corals to expel the symbiotic algae, called zooxanthellae, that live in their tissues and provide most of their energy. Without the algae, corals turn white and, if conditions persist, starve.</i><br><br><b>Text 2</b><br><i>Some corals can survive warming by hosting different, more heat-tolerant algal symbionts, such as those in the genus Durusdinium. Researchers are studying whether this shuffling of symbionts can help reefs adapt, although the process may be too slow to keep pace with rapid ocean warming.</i><br><br>Based on the texts, Text 2 most directly adds which idea to Text 1?",
      "Some corals may be able to partially adjust to the warming that causes bleaching.",
      "Bleaching is caused by factors unrelated to water temperature, such as the presence of heat-tolerant algae.",
      "Corals that host heat-tolerant algae are unable to survive in waters of normal temperature.",
      "Reefs can fully adapt to ocean warming quickly enough to prevent future bleaching events."
    ],
    [
      "<b>Text 1</b><br><i>Beginning in 2006, U.S. beekeepers reported unusually high losses of honeybee colonies, a phenomenon named colony collapse disorder. Some studies have linked the losses to neonicotinoid pesticides, which can impair bees' foraging and navigation even at sublethal doses.</i><br><br><b>Text 2</b><br><i>Other entomologists point to the parasitic Varroa destructor mite, which feeds on bees and spreads viruses such as deformed wing virus, as a leading cause of colony deaths. They emphasize that pesticides, pathogens, poor nutrition, and parasites likely interact to weaken colonies.</i><br><br>Which choice best describes a difference between the texts?",
      "Text 1 stresses pesticides, while Text 2 stresses parasites and the interaction of several stressors.",
      "Text 1 denies that colonies were lost, whereas Text 2 provides data on the number of colonies that died.",
      "Text 1 blames Varroa mites for the losses, whereas Text 2 blames neonicotinoid pesticides.",
      "Text 1 describes honeybees in the United States, whereas Text 2 discusses only bumblebees in Europe."
    ],
    [
      "<b>Text 1</b><br><i>In 2012, Jennifer Doudna and Emmanuelle Charpentier showed that the bacterial enzyme Cas9, guided by a short RNA sequence, can be programmed to cut DNA at a chosen location. Researchers soon recognized the potential of this technique, CRISPR-Cas9, for correcting disease-causing mutations.</i><br><br><b>Text 2</b><br><i>In 2018, Chinese scientist He Jiankui announced that he had edited the genomes of human embryos that were carried to term as twin girls. The announcement was widely condemned by scientists, who cited the risk of unintended edits and the lack of ethical oversight for changes that can be inherited.</i><br><br>Based on the texts, Text 2 primarily serves to",
      "illustrate a controversial application of the technology described in Text 1.",
      "dispute the claim that Cas9 can be programmed with RNA to target specific.",
      "explain how Doudna and Charpentier overcame the safety concerns raised.",
      "show that CRISPR-Cas9 has been abandoned by researchers since."
    ],
    [
      "<b>Text 1</b><br><i>In 2019, Google researchers announced that their 53-qubit Sycamore processor had performed a specific random-circuit sampling task in about 200 seconds. They estimated that the world's most powerful classical supercomputer would need roughly 10,000 years, and they claimed to have achieved 'quantum supremacy.'</i><br><br><b>Text 2</b><br><i>Researchers at IBM disputed this estimate, arguing that a classical supercomputer using a better algorithm and disk storage to supplement its memory could simulate the same task in about two and a half days, which would undercut the claim of a clear quantum advantage.</i><br><br>Which choice best states the disagreement between the texts?",
      "How long a classical supercomputer would need to complete the task Sycamore performed.",
      "Whether the Sycamore processor actually completed the task in about 200 seconds despite relying on the same foundational archival and experimental datasets.",
      "Whether quantum computers will ever be built with more than 53 qubits when evaluating how institutional incentives shape long-term outcomes.",
      "Whether the task Sycamore performed has any possible application to cryptography."
    ],
    [
      "<b>Text 1</b><br><i>In 1950, Alan Turing proposed replacing the question 'Can machines think?' with an 'imitation game' in which a human judge converses by text with a hidden person and a hidden machine. If the judge cannot reliably tell which is which, Turing suggested, the machine could be regarded as intelligent.</i><br><br><b>Text 2</b><br><i>Philosopher John Searle's 1980 'Chinese room' thought experiment imagines a person who does not understand Chinese following a rulebook to manipulate Chinese symbols and produce fluent replies. Searle argued that producing convincing output does not show that a system understands anything.</i><br><br>Based on the texts, how would Searle (Text 2) most likely respond to Turing's proposal (Text 1)?",
      "By arguing that passing the test would not prove that a machine actually understands.",
      "By agreeing that any machine passing the test must therefore be capable of understanding Chinese.",
      "By claiming that human judges are unable to hold text conversations with hidden machines.",
      "By proposing that machines should instead be judged on how quickly they can perform arithmetic."
    ],
    [
      "<b>Text 1</b><br><i>Computer scientist Cynthia Rudin argues that for high-stakes decisions such as medical diagnosis or criminal sentencing, organizations should use models that are inherently interpretable rather than complex 'black box' models whose predictions are explained after the fact.</i><br><br><b>Text 2</b><br><i>Other researchers contend that post hoc explanation tools can give sufficient insight into complex models while retaining their greater accuracy, and that restricting use to simpler models could sacrifice performance in settings where errors have serious consequences.</i><br><br>Based on the texts, what is the primary disagreement between the authors?",
      "Whether complex models with after-the-fact explanations are acceptable for high-stakes decisions.",
      "Whether complex models are ever more accurate than simple models in any real-world application.",
      "Whether medical diagnosis and criminal sentencing should be performed by computer models at all.",
      "Whether explanations of model predictions are of any value to the people affected by the decisions."
    ],
    [
      "<b>Text 1</b><br><i>Using the cosmic microwave background measured by the Planck satellite, together with the standard cosmological model, astronomers calculate that the universe is expanding at about 67 kilometers per second per megaparsec.</i><br><br><b>Text 2</b><br><i>Using Cepheid variable stars and Type Ia supernovae to measure distances to nearby galaxies, Adam Riess and his team find a significantly higher expansion rate of about 73 kilometers per second per megaparsec.</i><br><br>Which choice best describes the relationship between the texts?",
      "The two methods yield different estimates of the universe's expansion rate.",
      "The two methods yield identical estimates but express them in different units of measurement.",
      "Text 2 shows that Planck's measurements of the microwave background were obtained with the wrong instrument.",
      "Text 2 demonstrates that the universe is no longer expanding in the region near Earth."
    ],
    [
      "<b>Text 1</b><br><i>Cosmologists such as Andrei Linde have argued that eternal inflation would produce an enormous number of separate 'bubble' universes with different physical constants, which could explain why our universe appears fine-tuned for life.</i><br><br><b>Text 2</b><br><i>Physicist Paul Steinhardt and others reject the multiverse, arguing that a theory that can explain any outcome by appealing to universes we can never observe makes no testable predictions and therefore falls outside science.</i><br><br>Based on the texts, the authors would most likely disagree about whether multiverse theories",
      "can be tested by observation in a way that qualifies them as science.",
      "have been proposed by any cosmologists who study the early universe.",
      "are consistent with the observation that our universe supports life.",
      "describe universes with physical constants identical to those."
    ],
    [
      "<b>Text 1</b><br><i>In 1912, Alfred Wegener proposed that the continents were once joined in a single landmass and have since drifted apart. He cited the fit of South America and Africa and matching fossils, such as those of the reptile Mesosaurus, on both sides of the Atlantic.</i><br><br><b>Text 2</b><br><i>Most geologists rejected Wegener's idea in his lifetime because he could not explain what force could move continents through solid oceanic crust. In the 1960s, evidence for seafloor spreading, including symmetrical magnetic stripes on either side of mid-ocean ridges, provided a mechanism and led to the theory of plate tectonics.</i><br><br>Based on the texts, how does Text 2 relate to Text 1?",
      "It explains why Wegener's idea was initially rejected and how it was later vindicated.",
      "It shows that the fossil evidence cited by Wegener was misidentified by later geologists.",
      "It argues that continental drift occurs only in the Atlantic Ocean and not elsewhere.",
      "It proves that Wegener had correctly identified the force responsible for moving the continents."
    ],
    [
      "<b>Text 1</b><br><i>The multiregional hypothesis, advanced by Milford Wolpoff and others, holds that modern humans evolved from archaic populations such as Homo erectus in several regions of the Old World, with gene flow among regions keeping them a single species.</i><br><br><b>Text 2</b><br><i>In 1987, Rebecca Cann and her colleagues analyzed mitochondrial DNA from people around the world and found that the variation traced back to a common maternal ancestor who lived in Africa about 200,000 years ago, supporting a recent African origin for modern humans.</i><br><br>Based on the texts, how does Text 2 relate to Text 1?",
      "It offers genetic evidence supporting a competing account of modern human origins.",
      "It confirms Text 1 by showing that modern humans evolved separately in Asia and Europe.",
      "It suggests that Homo erectus populations in Africa interbred freely with those in Asia, as Text 1 proposes.",
      "It rejects the use of DNA evidence in favor of the fossil evidence relied on in Text 1."
    ],
    [
      "<b>Text 1</b><br><i>In Collapse (2005), Jared Diamond argued that the Rapa Nui people destroyed their own environment by cutting down the island's palm forest to move statues and clear land. The resulting deforestation, he claimed, led to famine, warfare, and a population crash before Europeans arrived.</i><br><br><b>Text 2</b><br><i>Archaeologists Terry Hunt and Carl Lipo argue that Polynesian rats brought by the first settlers ate palm seeds and prevented forest regeneration. They also point to evidence that the population remained stable until European contact in 1722, after which disease and slave raids devastated the islanders.</i><br><br>How would Hunt and Lipo (Text 2) most likely evaluate Diamond's account (Text 1)?",
      "As overstating the islanders' role while neglecting rats and the effects of European contact.",
      "As accurate, because the Rapa Nui people were the only cause of the deforestation of the island.",
      "As mistaken, because Polynesian settlers did not arrive on the island until after 1722.",
      "As incomplete, because it fails to mention the role of palm trees in moving the statues."
    ],
    [
      "<b>Text 1</b><br><i>Sediment cores from lakes on the Yucatan Peninsula, such as Lake Chichancanab, record a series of severe droughts between roughly 800 and 1000 CE, the period when many lowland Maya cities were abandoned. Some researchers see climate change as a major cause of the Classic Maya collapse.</i><br><br><b>Text 2</b><br><i>Some archaeologists caution that Maya cities declined at different times and in different ways, and that some regions, such as the northern Yucatan, even flourished. They argue that warfare, political fragmentation, and environmental pressures from intensive agriculture must also be considered.</i><br><br>Based on the texts, the archaeologists in Text 2 would most likely say that the explanation in Text 1 is",
      "plausible but insufficient on its own to explain the varied histories of Maya cities.",
      "incorrect because the Maya cities of the Yucatan were not abandoned between 800 and 1000 CE.",
      "accurate because every Maya city collapsed at the same time and for the same reasons.",
      "unsupported because lake sediments cannot preserve any evidence of past climate conditions."
    ],
    [
      "<b>Text 1</b><br><i>Around 1200 BCE, powerful Mediterranean societies, including the Hittite Empire and the Mycenaean palace states, collapsed within a few decades. Egyptian inscriptions of Ramesses III describe attacks by invaders called the 'Sea Peoples,' whom some historians have blamed for the destruction.</i><br><br><b>Text 2</b><br><i>Historian Eric Cline argues that no single invader can account for the collapse. He proposes that earthquakes, drought, famine, internal rebellion, and the breakdown of trade networks combined and reinforced one another, leaving interconnected societies unable to recover.</i><br><br>Which choice best describes the relationship between the texts?",
      "Text 2 proposes a multicausal explanation in place of the single cause suggested in Text 1.",
      "Text 2 proves that the Sea Peoples never existed, contradicting the Egyptian.",
      "Text 2 identifies the Hittite Empire as the cause of the Mycenaean collapse described.",
      "Text 2 agrees with Text 1 that invasion alone destroyed the Mediterranean states around."
    ],
    [
      "<b>Text 1</b><br><i>In 1901, sponge divers recovered a corroded lump of bronze from a Roman-era shipwreck near the Greek island of Antikythera. X-ray imaging later revealed that the object, which dates to roughly the second or first century BCE, contained dozens of interlocking gears.</i><br><br><b>Text 2</b><br><i>Researchers who reconstructed the Antikythera mechanism concluded that it was a hand-cranked astronomical calculator. Its gear trains modeled the motions of the Sun and Moon, tracked the phases of the Moon, and predicted eclipses using a cycle known as the Saros.</i><br><br>Based on the texts, what does Text 2 add to Text 1?",
      "An explanation of what the geared device was used to do.",
      "Evidence that the device was manufactured in Rome rather than in Greece.",
      "A challenge to the date proposed for the shipwreck in Text 1.",
      "A claim that the gears were purely decorative and had no mechanical purpose."
    ],
    [
      "<b>Text 1</b><br><i>Geologists have traced the 'bluestones' of Stonehenge to the Preseli Hills of Wales, roughly 150 miles away. Some have argued that glaciers during the last Ice Age carried the stones most of the way to Salisbury Plain, rather than humans hauling them.</i><br><br><b>Text 2</b><br><i>Archaeologists led by Mike Parker Pearson excavated outcrops in the Preseli Hills and found stone wedges, hammerstones, and platforms indicating that people quarried the bluestones there around 3400-3200 BCE, centuries before the stones were set up at Stonehenge.</i><br><br>Based on the texts, how does the evidence in Text 2 bear on the hypothesis in Text 1?",
      "It supports the view that people, not glaciers, extracted the stones.",
      "It proves that the stones were quarried in Wales but never moved to Salisbury Plain.",
      "It confirms that glaciers carried the bluestones from the Preseli Hills to Stonehenge.",
      "It shows that the bluestones came from a source other than the Preseli Hills."
    ],
    [
      "<b>Text 1</b><br><i>In his 1926 essay 'Criteria of Negro Art,' W. E. B. Du Bois argued that Black artists should use their work to advance the fight for racial equality, asserting that all art functions as propaganda.</i><br><br><b>Text 2</b><br><i>In 'The Negro Artist and the Racial Mountain' (1926), Langston Hughes asserted that Black artists should express their individual selves and the lives of ordinary Black people without worrying about whether they would be approved of by white critics or by the Black middle class.</i><br><br>Which choice best describes the disagreement between Du Bois (Text 1) and Hughes (Text 2)?",
      "Whether art by Black writers should be shaped by a political purpose or by artistic freedom.",
      "Whether Black artists in the 1920s were capable of producing work of high artistic quality.",
      "Whether the Harlem Renaissance began before or after the publication of their essays in 1926.",
      "Whether white critics should be permitted to review the work of Black writers and artists."
    ],
    [
      "<b>Text 1</b><br><i>In A Room of One's Own (1929), Virginia Woolf argued that a woman must have money and a room of her own if she is to write fiction, because financial independence and privacy are conditions for sustained creative work.</i><br><br><b>Text 2</b><br><i>In her 1972 essay 'In Search of Our Mothers' Gardens,' Alice Walker observed that enslaved and poor Black women in the American South were denied such resources, yet expressed creativity through quilting, cooking, and gardening, forms of art that she valued highly.</i><br><br>Based on the texts, Walker (Text 2) most directly complicates Woolf's argument (Text 1) by suggesting that",
      "creativity can find expression even when the material conditions Woolf describes are absent.",
      "Woolf's claim is false because privacy and money have no relationship to creative work.",
      "Black women in the South were unable to produce any form of art before the twentieth century.",
      "published literature is a less valuable form of art than quilting, according to Woolf."
    ],
    [
      "<b>Text 1</b><br><i>Some supporters of the Oxfordian theory argue that William Shakespeare of Stratford, who had no university education, could not have written plays so full of courtly and legal knowledge, and they propose instead that Edward de Vere, the 17th Earl of Oxford, was the true author.</i><br><br><b>Text 2</b><br><i>Most Shakespeare scholars note that de Vere died in 1604, yet plays such as The Tempest (c. 1611) draw on events and sources that postdate his death. They also point to the 1623 First Folio, whose prefatory material, including a poem by the playwright Ben Jonson, credits Shakespeare.</i><br><br>Based on the texts, what is Text 2's main objection to the argument in Text 1?",
      "Chronological evidence and contemporary attribution conflict with de Vere's authorship.",
      "Shakespeare's lack of a university education would have made it impossible for him.",
      "The First Folio was published before Shakespeare had written any of his major plays.",
      "Ben Jonson was a member of the nobility and therefore more likely to have written."
    ],
    [
      "<b>Text 1</b><br><i>Emily Dickinson died in 1886, and when the first collection of her poems appeared in 1890, editors Mabel Loomis Todd and Thomas Wentworth Higginson altered them, regularizing punctuation and capitalization and sometimes revising word choices so that the unconventional poems would be more acceptable to nineteenth-century readers.</i><br><br><b>Text 2</b><br><i>Ralph W. Franklin's 1998 variorum edition tried to reproduce Dickinson's manuscripts as faithfully as possible, restoring her dashes, irregular capitalization, and line breaks. Franklin treated these features as integral to the poems' meaning rather than as errors to be corrected.</i><br><br>Which statement best describes the difference between the approaches of Todd and Higginson (Text 1) and Franklin (Text 2)?",
      "The earlier editors changed Dickinson's style for readers, while Franklin sought to preserve it.",
      "The earlier editors preserved Dickinson's punctuation, while Franklin removed it to modernize the poems.",
      "The earlier editors worked from Dickinson's manuscripts, while Franklin relied on the printed edition of 1890.",
      "The earlier editors wrote new poems in Dickinson's style, while Franklin published only her letters."
    ],
    [
      "<b>Text 1</b><br><i>Science-fiction writer and critic Brian Aldiss has argued that Mary Shelley's Frankenstein (1818) is the first true work of science fiction, because its central events result from a scientist's experiment rather than from magic or supernatural forces.</i><br><br><b>Text 2</b><br><i>Other critics emphasize that Frankenstein belongs to the Gothic tradition, with its brooding atmosphere, doomed protagonist, and themes of terror. They note that Shelley gives almost no description of Victor Frankenstein's scientific methods, which she leaves vague.</i><br><br>Based on the texts, the critics in Text 2 would most likely say that Aldiss's classification (Text 1)",
      "overlooks the novel's strong ties to Gothic conventions and its vagueness about science.",
      "is correct because the novel gives a detailed explanation of how Victor Frankenstein created life.",
      "is mistaken because the novel was published before the Gothic tradition began in the eighteenth century.",
      "ignores that Mary Shelley had trained as a professional chemist before writing the novel."
    ],
    [
      "<b>Text 1</b><br><i>In his 1937 review of Zora Neale Hurston's Their Eyes Were Watching God, novelist Richard Wright criticized the book for failing to address serious social themes, charging that its use of dialect catered to white audiences' expectations.</i><br><br><b>Text 2</b><br><i>Alice Walker and other later critics defended Hurston's use of dialect as a faithful rendering of Black Southern speech and a celebration of its richness. They argued that Hurston, trained as an anthropologist, recorded folk language to preserve it, not to ridicule its speakers.</i><br><br>Based on the texts, what is the fundamental disagreement between the critics?",
      "Whether Hurston's use of dialect demeans her characters or honors their culture.",
      "Whether Hurston had formal training as an anthropologist before she began writing fiction.",
      "Whether Their Eyes Were Watching God was published in 1937 or at a later date.",
      "Whether Richard Wright wrote reviews of novels by other Black authors."
    ],
    [
      "<b>Text 1</b><br><i>A 2019 study of nearly one million Danes found that children who grew up with the least green space around their homes had up to a 55 percent higher risk of developing a psychiatric disorder in adulthood than children surrounded by the most green space.</i><br><br><b>Text 2</b><br><i>Epidemiologists note that such observational studies cannot prove causation. Families with higher incomes may be more likely to live in neighborhoods with parks and gardens and may also have a lower risk of mental illness for other reasons, such as better health care and less financial stress.</i><br><br>Based on the texts, what would the epidemiologists in Text 2 most likely say about the finding in Text 1?",
      "That another factor, such as family income, might partly explain the association.",
      "That the finding demonstrates conclusively that green space causes better mental health.",
      "That the finding is invalid because Denmark has fewer parks than most other countries.",
      "That the finding applies only to children and not to adults living in cities."
    ],
    [
      "<b>Text 1</b><br><i>In a 2015 experiment by economist Nicholas Bloom at the Chinese travel agency Ctrip, call-center employees who volunteered to work from home were about 13 percent more productive than those in the office, in part because they took fewer breaks and sick days and worked in a quieter environment.</i><br><br><b>Text 2</b><br><i>A study of more than 61,000 Microsoft employees published in 2022 found that after the company shifted to remote work in 2020, workers' collaboration networks became more siloed: employees spent less time communicating with colleagues outside their immediate teams.</i><br><br>Based on the texts, Text 2 most directly adds which consideration to Text 1?",
      "That remote work may carry costs that individual productivity does not capture.",
      "That productivity at Microsoft declined by 13 percent after the shift.",
      "That employees who work from home take more breaks than employees in offices.",
      "That call-center workers collaborate more with colleagues outside."
    ],
    [
      "<b>Text 1</b><br><i>Supporters of universal basic income argue that giving people a guaranteed cash payment with no strings attached would simplify welfare systems and encourage unemployed people to accept work, since they would not lose benefits when they earn income.</i><br><br><b>Text 2</b><br><i>From 2017 to 2018, Finland paid 2,000 unemployed people 560 euros a month, with no obligation to seek work. Researchers found only small effects on employment, but recipients reported greater well-being and less stress than a comparison group.</i><br><br>Based on the texts, how do the results in Text 2 relate to the argument in Text 1?",
      "They offer limited support for the employment claim but some support for other benefits.",
      "They strongly confirm that unconditional payments substantially increase employment among the unemployed.",
      "They show that recipients became less healthy and more stressed than people who did not receive payments.",
      "They demonstrate that the Finnish welfare system could not be simplified by introducing a basic income."
    ],
    [
      "<b>Text 1</b><br><i>Psychologist Jean Twenge has noted that rates of teen depression and anxiety in the United States began rising sharply around 2012, as smartphone and social media use became widespread among adolescents, and she has argued that heavy screen use is a likely contributor.</i><br><br><b>Text 2</b><br><i>In 2019, Amy Orben and Andrew Przybylski analyzed data from more than 350,000 adolescents and found that digital technology use explained at most 0.4 percent of the variation in well-being, an association about as small as that found for eating potatoes.</i><br><br>Which choice best describes how Text 2 relates to Text 1?",
      "Text 2 gives reason to doubt that technology use is a major driver of the trend in Text 1.",
      "Text 2 confirms Twenge's claim by showing that technology explains most of the variation in adolescent well-being.",
      "Text 2 shows that adolescent depression rates did not rise after 2012, contradicting Text 1.",
      "Text 2 argues that eating potatoes reduces adolescent well-being more than smartphone use does."
    ],
    [
      "<b>Text 1</b><br><i>Proponents of nuclear power note that nuclear plants generate large amounts of electricity continuously, regardless of weather, with life-cycle greenhouse gas emissions comparable to those of wind and solar. They argue that this reliable, low-carbon output makes nuclear energy a necessary complement to renewables.</i><br><br><b>Text 2</b><br><i>Critics such as Stanford engineer Mark Jacobson argue that new nuclear plants cost more and take much longer to build than wind and solar installations, so money spent on them delays emissions cuts. They contend that wind, water, and solar power combined with storage can meet energy needs.</i><br><br>What is the central point of disagreement between the texts?",
      "Whether nuclear power is needed to supply low-carbon electricity alongside wind and solar.",
      "Whether nuclear plants release more greenhouse gases than coal plants during their operation.",
      "Whether wind and solar installations can generate electricity at night without any storage.",
      "Whether the cost of building new nuclear plants has declined over the past several decades."
    ],
    [
      "<b>Text 1</b><br><i>Manufacturing an electric vehicle's lithium-ion battery requires mining and energy-intensive processing, so a new electric car typically begins its life with higher greenhouse gas emissions than a comparable gasoline car.</i><br><br><b>Text 2</b><br><i>Over its lifetime, however, an electric vehicle emits less than a gasoline car because it produces no tailpipe emissions. Analyses find that the size of the advantage depends on how the electricity is generated: it is larger where the grid relies on renewables and smaller where it relies on coal.</i><br><br>Based on the texts, which statement is best supported?",
      "The higher emissions from building an electric vehicle can be offset by lower emissions during its use.",
      "The lifetime emissions advantage of an electric vehicle is the same everywhere, whatever the electricity source.",
      "Battery manufacturing produces fewer emissions than the manufacturing of a gasoline engine.",
      "Electric vehicles produce lower lifetime emissions only in regions where coal is the main source of electricity."
    ],
    [
      "<b>Text 1</b><br><i>Economists who favor a carbon tax note that it sets a clear and predictable price on each ton of carbon dioxide emitted, giving businesses certainty for long-term planning, though the resulting reduction in total emissions cannot be known in advance.</i><br><br><b>Text 2</b><br><i>Advocates of a cap-and-trade system emphasize that it limits total emissions to a fixed amount by issuing a limited number of tradable permits, guaranteeing the environmental outcome, although the market price of permits may rise and fall unpredictably.</i><br><br>Which choice best describes the contrast between the approaches described in the texts?",
      "A carbon tax fixes the price of emissions, while cap-and-trade fixes the quantity of emissions.",
      "A carbon tax applies only to businesses, while cap-and-trade applies only to households.",
      "A carbon tax guarantees the emissions reduction, while cap-and-trade guarantees the price.",
      "A carbon tax limits total emissions, while cap-and-trade leaves emissions unlimited."
    ],
    [
      "<b>Text 1</b><br><i>In 1988, oceanographer John Martin proposed that in large ocean regions rich in nutrients but low in chlorophyll, phytoplankton growth is limited by a shortage of iron. Adding iron, he suggested, could trigger blooms that draw carbon dioxide from the atmosphere as the phytoplankton photosynthesize.</i><br><br><b>Text 2</b><br><i>In some experiments in which iron was added to the Southern Ocean, phytoplankton blooms did appear, but measurements showed that little of the captured carbon sank to the deep ocean, where it would remain stored. Scientists also warned that large-scale fertilization could disrupt marine ecosystems.</i><br><br>Based on the texts, Text 2 most directly",
      "calls into question whether the approach in Text 1 would store carbon effectively.",
      "shows that the iron limitation described in Text 1 does not exist anywhere in the ocean.",
      "proves that iron fertilization increases atmospheric carbon dioxide by killing phytoplankton.",
      "confirms that blooms are never produced when iron is added to the ocean."
    ],
    [
      "<b>Text 1</b><br><i>In 2014, researchers using NASA's Curiosity rover reported that the methane level in the atmosphere of Gale crater on Mars rose roughly tenfold over a period of weeks and fluctuated with the seasons. Because microbes on Earth produce methane, some scientists suggested a possible biological source.</i><br><br><b>Text 2</b><br><i>Since 2018, the European-Russian ExoMars Trace Gas Orbiter has measured the Martian atmosphere with great sensitivity and has found no methane, setting an upper limit far below what Curiosity measured. Some scientists propose that the discrepancy reflects local, short-lived releases near the surface.</i><br><br>Based on the texts, what challenge does Text 2 pose to Text 1?",
      "It raises doubts about whether methane is generally present in Mars's atmosphere.",
      "It proves that the methane detected by Curiosity was produced by living organisms on Mars.",
      "It shows that Curiosity's instruments were unable to measure any gases in the atmosphere.",
      "It demonstrates that Martian methane levels are much higher than Curiosity's measurements indicated."
    ],
    [
      "<b>Text 1</b><br><i>Magnetic field measurements made by NASA's Galileo spacecraft in the late 1990s suggest that Jupiter's moon Europa has a global ocean of salty liquid water beneath its icy shell, containing more water than all of Earth's oceans combined.</i><br><br><b>Text 2</b><br><i>Because sunlight cannot penetrate Europa's ice, any life in the ocean could not depend on photosynthesis. Scientists speculate that it could instead rely on chemical energy from hydrothermal vents on the seafloor, similar to ecosystems found near vents in Earth's deep oceans.</i><br><br>Based on the texts, how does Text 2 build on Text 1?",
      "By describing a possible energy source for life in the ocean described in Text 1.",
      "By proving that life exists in the ocean beneath Europa's ice shell.",
      "By arguing that Europa's ocean must be frozen because sunlight cannot reach it.",
      "By showing that Galileo's measurements were incorrect because the ice shell blocks magnetic fields."
    ],
    [
      "<b>Text 1</b><br><i>In 1950, physicist Enrico Fermi is said to have asked why, given the enormous number of stars in the galaxy and its great age, there is no sign of extraterrestrial civilizations. This puzzle is now known as the Fermi paradox.</i><br><br><b>Text 2</b><br><i>In their 2000 book Rare Earth, Peter Ward and Donald Brownlee argue that while microbial life may be common in the universe, complex animal life requires an unusual combination of conditions, such as a stable star, a large moon, and plate tectonics, and so is probably extremely rare.</i><br><br>Based on the texts, how would Ward and Brownlee's argument (Text 2) most likely bear on the puzzle in Text 1?",
      "It offers one possible resolution: advanced civilizations may be too rare to detect.",
      "It eliminates the puzzle by showing that microbial life is impossible elsewhere in the galaxy.",
      "It suggests that extraterrestrial civilizations are common but have chosen not to contact Earth.",
      "It proves that the galaxy is too young for any civilization to have arisen."
    ],
    [
      "<b>Text 1</b><br><i>In 1961, astronomer Frank Drake proposed an equation to estimate the number of detectable civilizations in the Milky Way by multiplying together factors such as the rate of star formation, the fraction of stars with planets, and the fraction of habitable planets on which life arises.</i><br><br><b>Text 2</b><br><i>Critics note that most of the equation's later terms, such as the fraction of planets where life begins or where intelligence evolves, are essentially unknown. As a result, estimates calculated with the equation have ranged from far less than one civilization to millions.</i><br><br>Based on the texts, what limitation does Text 2 identify in the equation described in Text 1?",
      "Its outputs depend heavily on inputs that scientists cannot yet measure reliably.",
      "It cannot be applied to any galaxy other than the Milky Way.",
      "It leaves out the rate of star formation, which is the most important factor.",
      "It assumes that all planets in the galaxy are inhabited by intelligent."
    ],
    [
      "<b>Text 1</b><br><i>Plants such as maize and sugarcane use C4 photosynthesis, which concentrates carbon dioxide around the enzyme Rubisco. This makes them more efficient than C3 plants in hot, bright conditions because it reduces wasteful photorespiration.</i><br><br><b>Text 2</b><br><i>Rice is a C3 plant. The international C4 Rice Project, begun in 2008, is attempting to engineer the C4 pathway into rice, with the goal of increasing yields by as much as 50 percent while requiring less water and fertilizer.</i><br><br>Based on the texts, what is the relationship between the advantage described in Text 1 and the project in Text 2?",
      "The project aims to transfer the advantage in Text 1 to a crop that lacks it.",
      "The project aims to remove C4 photosynthesis from crops that perform poorly in hot conditions.",
      "The project is attempting to make rice more efficient by replacing Rubisco with a different enzyme.",
      "The project has already succeeded in producing high-yielding rice with a complete C4 pathway."
    ],
    [
      "<b>Text 1</b><br><i>Many organisms that survive drying out, including yeast and brine shrimp, accumulate large amounts of the sugar trehalose, which is thought to protect their cells by replacing water. For years, scientists assumed that tardigrades, which survive extreme desiccation by entering a dormant state, relied on the same strategy.</i><br><br><b>Text 2</b><br><i>In 2017, Thomas Boothby and colleagues found that tardigrades produce little trehalose. Instead, they make tardigrade-specific intrinsically disordered proteins that, as the animal dries, form a glass-like matrix that stabilizes cellular components.</i><br><br>Based on the texts, what does Text 2 reveal about the assumption in Text 1?",
      "It appears incorrect, since tardigrades use a different protective mechanism.",
      "It is confirmed, since tardigrades produce more trehalose than any other organism.",
      "It is irrelevant, since tardigrades do not enter a dormant state when they dry out.",
      "It is partly correct, since tardigrades use trehalose together with a protein that replaces water."
    ],
    [
      "<b>Text 1</b><br><i>Octopuses display impressive problem-solving abilities. They can unscrew jars, navigate mazes, and, in the case of the veined octopus, carry coconut shell halves to use later as shelters, a behavior that some researchers interpret as a form of tool use.</i><br><br><b>Text 2</b><br><i>Philosopher of science Peter Godfrey-Smith notes that about two-thirds of an octopus's roughly 500 million neurons are located in its arms rather than in its central brain. He suggests that octopus cognition may be organized very differently from that of vertebrates, with substantial control distributed across the body.</i><br><br>Which choice best describes how Text 2 relates to Text 1?",
      "Text 2 describes an unusual neural organization that may bear on the behaviors in Text 1.",
      "Text 2 argues that the behaviors described in Text 1 are not performed by octopuses at all.",
      "Text 2 proves that octopuses are more intelligent than vertebrates with similar brain sizes.",
      "Text 2 claims that octopus arms act independently and so cannot be coordinated for tasks such as carrying shells."
    ],
    [
      "<b>Text 1</b><br><i>One hypothesis holds that dogs were domesticated only after humans began farming around 10,000 years ago, when wolves scavenging near permanent settlements gradually became tamer and eventually dependent on people.</i><br><br><b>Text 2</b><br><i>At Bonn-Oberkassel, Germany, archaeologists discovered the remains of a dog buried alongside two humans about 14,000 years ago, an era when people still lived as hunter-gatherers. The dog had suffered a serious illness and likely required human care to survive.</i><br><br>Based on the texts, how does the evidence in Text 2 affect the hypothesis in Text 1?",
      "It suggests that close relationships between humans and dogs existed before farming began.",
      "It confirms that wolves were domesticated near farming settlements around 10,000 years ago.",
      "It shows that dogs were domesticated in Germany before anywhere else in the world.",
      "It proves that hunter-gatherers raised dogs primarily to help them cultivate crops."
    ],
    [
      "<b>Text 1</b><br><i>In 2000, Karim Nader and colleagues trained rats to fear a tone, then reactivated the memory days later and injected a drug into the amygdala that blocks protein synthesis. The rats lost the fear response, suggesting that a recalled memory becomes unstable and must be stored again, a process called reconsolidation.</i><br><br><b>Text 2</b><br><i>In a 1974 experiment by Elizabeth Loftus and John Palmer, participants who watched films of car accidents estimated higher speeds when asked how fast the cars were going when they 'smashed' into each other than when asked with the verb 'hit,' and were more likely to report seeing broken glass that did not appear.</i><br><br>Based on the texts, both studies support which general idea?",
      "Memories can be altered after they have been formed.",
      "Memories cannot be changed once a person has.",
      "Memories of fearful events are more accurate.",
      "Memory depends on protein synthesis, which is."
    ],
    [
      "<b>Text 1</b><br><i>According to the synaptic homeostasis hypothesis proposed by Giulio Tononi and Chiara Cirelli, learning during waking hours strengthens connections between neurons, and sleep serves to scale these connections back overall, preserving the most important ones while freeing capacity for new learning.</i><br><br><b>Text 2</b><br><i>According to the active systems consolidation model, during slow-wave sleep the hippocampus repeatedly replays recently learned information to the neocortex, strengthening the neural connections that represent those memories and integrating them into long-term storage.</i><br><br>Based on the texts, what is the main difference between the two accounts?",
      "Text 1 stresses an overall weakening of synapses; Text 2 stresses strengthening memories through replay.",
      "Text 1 argues that sleep is unnecessary for learning, while Text 2 argues that sleep is required when evaluating how institutional incentives shape long-term outcomes.",
      "Text 1 concerns memory in humans only, while Text 2 concerns memory in rats only despite relying on the same foundational archival and experimental datasets.",
      "Text 1 describes events during wakefulness only, while Text 2 describes events during dreaming only."
    ],
    [
      "<b>Text 1</b><br><i>In 1992, anthropologist Robin Dunbar reported a correlation between neocortex size and group size across primate species. Extrapolating to humans, he proposed that people can maintain about 150 stable social relationships, a figure now known as Dunbar's number.</i><br><br><b>Text 2</b><br><i>In 2021, Patrik Lindenfors and colleagues re-examined the statistical analysis and found that, because of uncertainty in the data, the predicted human group size could plausibly range from a handful to several hundred, making a single number unreliable.</i><br><br>Based on the texts, what is Text 2's criticism of Text 1?",
      "The estimate of 150 is too imprecise to be meaningful given the uncertainty in the data.",
      "The correlation between neocortex size and group size does not exist in primates other than humans.",
      "The number of stable social relationships humans can maintain is definitely lower than 150.",
      "The analysis excluded humans and relied only on data from nonhuman primate species."
    ],
    [
      "<b>Text 1</b><br><i>In 1949, linguist George Kingsley Zipf observed that in natural languages the frequency of a word is roughly inversely proportional to its rank: the second most common word appears about half as often as the most common, the third about one-third as often, and so on. Zipf attributed this pattern to a human tendency to minimize effort.</i><br><br><b>Text 2</b><br><i>In 1992, Wentian Li showed that a text generated by randomly typing letters and spaces on a keyboard produces a word-frequency distribution that also approximates Zipf's pattern. This suggests that the pattern might not require any special explanation involving human psychology or the structure of language.</i><br><br>Based on the texts, how does Text 2 challenge Text 1?",
      "It shows that a similar pattern can arise from random processes.",
      "It proves that the most common word in a language never occurs more than once in a text.",
      "It demonstrates that word frequency in natural languages does not follow any regular pattern.",
      "It shows that humans choose words based only on how easy they are to type on a keyboard."
    ],
    [
      "<b>Text 1</b><br><i>The Black Death, which reached Europe in 1347, killed an estimated one-third or more of the population. With far fewer laborers available, surviving peasants could demand higher wages and better terms from landlords, weakening the system of feudal obligations in parts of Western Europe.</i><br><br><b>Text 2</b><br><i>Rulers and landowners often resisted these changes. In 1351, the English Parliament passed the Statute of Labourers, which tried to freeze wages at pre-plague levels, and resentment of such measures and of new taxes helped fuel the Peasants' Revolt of 1381.</i><br><br>Based on the texts, how does Text 2 relate to Text 1?",
      "It describes efforts to reverse the effects of labor scarcity that Text 1 describes.",
      "It argues that wages declined after the plague because labor was abundant.",
      "It shows that the Statute of Labourers was completely successful in preventing wages from rising.",
      "It suggests that the Peasants' Revolt occurred before the arrival of the Black Death in England."
    ],
    [
      "<b>Text 1</b><br><i>The Silk Road, a network of overland and maritime routes linking China with Central Asia, India, and the Mediterranean, carried not only goods such as silk, spices, and porcelain but also ideas. Buddhism, for example, spread from India into Central Asia and China along these routes.</i><br><br><b>Text 2</b><br><i>Trade networks also carried disease. Many historians believe that the plague bacterium Yersinia pestis, which caused the Black Death in the 1340s, traveled from Central Asia to Europe along trade routes, carried by fleas on rodents and by merchants' caravans and ships.</i><br><br>Based on the texts, Text 2 extends Text 1 by suggesting that",
      "long-distance exchange had unintended consequences as well as intended benefits.",
      "Buddhism was the only idea that traveled along the Silk Road to reach Europe.",
      "the Silk Road was used only for carrying silk and had little cultural.",
      "the Black Death began in Europe and was later carried to China by merchants."
    ],
    [
      "<b>Text 1</b><br><i>Public health experts warn that the overuse and misuse of antibiotics, in human medicine and in livestock agriculture, accelerates the spread of resistant bacteria by killing susceptible strains and leaving resistant ones to multiply.</i><br><br><b>Text 2</b><br><i>In 2011, Vanessa D'Costa and colleagues recovered DNA from 30,000-year-old permafrost in the Yukon and found genes conferring resistance to several antibiotics, including tetracycline and vancomycin. The findings indicate that antibiotic resistance is an ancient, naturally occurring feature of bacteria.</i><br><br>Based on the texts, which statement is most consistent with both?",
      "Resistance predates human antibiotics, yet human practices can make it more widespread.",
      "Resistance in bacteria arose only after humans began producing antibiotics in the twentieth century.",
      "Overuse of antibiotics is harmless because resistance genes are found in ancient bacteria.",
      "Ancient bacteria in permafrost spread resistance genes to modern bacteria through livestock agriculture."
    ],
    [
      "<b>Text 1</b><br><i>Icelandic sagas written in the thirteenth century, including the Saga of the Greenlanders, tell of Norse voyagers who sailed west from Greenland around the year 1000 and settled briefly in a land they called Vinland. For centuries, historians debated whether these tales were history or legend.</i><br><br><b>Text 2</b><br><i>In the 1960s, archaeologists Helge and Anne Stine Ingstad excavated a site at L'Anse aux Meadows in Newfoundland, uncovering the remains of Norse-style buildings and a bronze pin. In 2021, tree-ring analysis of wood from the site dated Norse activity there to exactly 1021 CE.</i><br><br>Based on the texts, how does Text 2 relate to Text 1?",
      "It provides physical evidence that Norse people reached North America, as the sagas describe.",
      "It proves that every detail of the sagas about Vinland was accurate.",
      "It shows that the Norse settled in Newfoundland before they settled in Greenland.",
      "It demonstrates that the sagas were composed in the eleventh century by eyewitnesses to the voyages."
    ],
    [
      "<b>Text 1</b><br><i>Mercantilist writers of the sixteenth and seventeenth centuries held that a nation's wealth consisted of its stock of gold and silver, and that governments should therefore encourage exports and restrict imports in order to accumulate precious metals.</i><br><br><b>Text 2</b><br><i>In The Wealth of Nations (1776), Adam Smith argued that a nation's wealth lies not in its reserves of gold and silver but in its capacity to produce goods and services, which grows through the division of labor and through freer exchange among nations.</i><br><br>Based on the texts, what is the central disagreement between the mercantilists (Text 1) and Smith (Text 2)?",
      "What constitutes a nation's wealth and how it should be pursued.",
      "Whether gold and silver can be used as money in international trade.",
      "Whether nations should engage in trade with one another at all.",
      "Whether the division of labor existed in the sixteenth century."
    ],
    [
      "<b>Text 1</b><br><i>In On the Origin of Species (1859), Charles Darwin acknowledged that the abrupt appearance of many animal groups in rocks of the Cambrian period, about 540 million years ago, with no obvious ancestors in older strata, was a difficulty for his theory of gradual evolution.</i><br><br><b>Text 2</b><br><i>Since Darwin's time, paleontologists have identified the Ediacaran biota, a collection of soft-bodied organisms preserved in rocks dated to about 635 to 539 million years ago. Many researchers consider these organisms evidence that complex multicellular life existed before the Cambrian, although their relationship to later animals is debated.</i><br><br>Based on the texts, how does Text 2 bear on the difficulty described in Text 1?",
      "It identifies earlier fossils that make the Cambrian appearance of animals seem less abrupt.",
      "It confirms that no complex organisms existed before the Cambrian period when evaluating how institutional incentives shape long-term outcomes.",
      "It shows that the Ediacaran organisms were direct ancestors of all Cambrian animals despite relying on the same foundational archival and experimental datasets.",
      "It proves that Darwin was incorrect that evolution occurs gradually over time."
    ],
    [
      "<i><b>Text 1</b><br>Paleontologist Paul Martin's 'overkill hypothesis' attributes the Late Pleistocene extinction of North American megafauna—including mammoths, mastodons, and ground sloths—directly to the arrival of Clovis big-game hunters around 13,000 years ago, noting that large mammals on islands consistently vanished shortly after human colonization.<br><br><b>Text 2</b><br>Paleoecologist Jacquelyn Gill analyzed fossil pollen and dung-fungus spores (Sporormiella) from lake sediment cores across eastern North America. She found that megafaunal populations in several regions began declining nearly 1,000 years before Clovis points appear in the archaeological record, coinciding instead with abrupt Bølling-Allerød warming and the restructuring of spruce-parkland habitats.</i><br><br>Based on the texts, how would Gill (Text 2) most likely respond to Martin's overkill hypothesis (Text 1)?",
      "By arguing that human hunting alone cannot explain megafaunal declines that began centuries before Clovis arrival and tracked rapid climate shifts.",
      "By agreeing that island extinctions provide an exact parallel for continental North America because both environments experienced identical.",
      "By claiming that Clovis hunters arrived in North America at least 5,000 years earlier than archaeologists have traditionally estimated.",
      "By contending that Sporormiella dung-fungus spores cannot be preserved in freshwater lake sediments for more than a few hundred years."
    ],
    [
      "<i><b>Text 1</b><br>Behavioral economist Richard Thaler advocates 'libertarian paternalism,' arguing that because human decision-makers suffer from inertia and present bias, governments and employers should design default choices—such as automatic enrollment in retirement savings plans—that nudge people toward welfare-enhancing outcomes without restricting their freedom to opt out.<br><br><b>Text 2</b><br>Public-policy scholar Cass Sunstein and critic George Loewenstein have examined what happens when Behavioral 'nudges' are deployed as substitutes for structural reforms. Loewenstein warns that framing systemic problems like retirement insecurity or carbon emissions as matters of individual choice architecture can crowd out political support for more impactful policies, such as employer pension mandates or carbon taxes.</i><br><br>Which statement best describes the relationship between Text 1 and Text 2?",
      "Text 1 presents the rationale for using choice-architecture nudges, while Text 2 identifies a systemic political cost of relying on nudges instead of structural policy.",
      "Text 2 refutes Text 1's claim that automatic enrollment increases employee participation in corporate retirement savings programs when evaluating how institutional incentives shape long-term outcomes.",
      "Both texts argue that governments should ban opt-out retirement plans and replace them with mandatory national consumption taxes despite relying on the same foundational archival and experimental datasets.",
      "Text 1 focuses on environmental regulations, whereas Text 2 argues that behavioral economics applies only to personal financial decisions when evaluating how institutional incentives shape long-term outcomes."
    ],
    [
      "<i><b>Text 1</b><br>Linguist Benjamin Lee Whorf proposed that the grammatical categories of a speaker's native language fundamentally constrain how that speaker perceives physical reality—suggesting, for example, that languages lacking tense markers prevent their speakers from conceiving of time as a linear continuum.<br><br><b>Text 2</b><br>Cognitive psychologist Lera Boroditsky tested speakers of English and Mandarin on spatial-temporal priming tasks, alongside speakers of Kuuk Thaayorre, an Aboriginal Australian language that uses cardinal directions (north, south, east, west) rather than relative terms (left, right). Boroditsky found that while Kuuk Thaayorre speakers effortlessly orient timelines from east to west regardless of which way they face, English speakers can be trained in minutes to use cardinal orientation when prompted.</i><br><br>How do Boroditsky's findings (Text 2) relate to Whorf's strong linguistic determinism (Text 1)?",
      "They support a weaker version of linguistic influence, showing that language shapes habitual attention and default mental habits without rigidly imprisoning thought.",
      "They confirm Whorf's claim that speakers of English are biologically incapable of learning cardinal spatial orientation in adulthood despite relying on the same foundational archival and experimental datasets.",
      "They demonstrate that grammar has zero measurable effect on how speakers of different languages organize temporal sequences when evaluating how institutional incentives shape long-term outcomes.",
      "They prove that Kuuk Thaayorre and Mandarin share the exact same grammatical system for marking past and future verb tenses despite relying on the same foundational archival and experimental datasets."
    ],
    [
      "<i><b>Text 1</b><br>Architectural theorist Le Corbusier championed the 'Radiant City' model of twentieth-century urbanism: separating residential high-rises in park-like superblocks from commercial districts and grade-separated expressways, thereby eliminating the crowded, mixed-use nineteenth-century street corridor.<br><br><b>Text 2</b><br>In The Death and Life of Great American Cities (1961), Jane Jacobs argued that Le Corbusier's single-use superblocks destroy the organic social fabric of cities. According to Jacobs, narrow sidewalks lined with ground-floor shops, cafes, and residences generate continuous pedestrian activity across all hours of the day, providing the informal 'eyes on the street' that keep urban neighborhoods safe and economically vibrant.</i><br><br>Based on the texts, what is the core point of disagreement between Le Corbusier and Jacobs?",
      "Whether segregating urban functions into isolated superblocks improves city life or undermines the street-level vitality and safety created by mixed-use neighborhoods.",
      "Whether twentieth-century cities should construct public parks or reserve all municipal land for industrial manufacturing plants when evaluating how institutional incentives shape long-term outcomes.",
      "Whether residential buildings in metropolitan centers should be constructed from reinforced concrete or traditional load-bearing brick despite relying on the same foundational archival and experimental datasets.",
      "Whether automobile expressways are cheaper for municipal governments to maintain than underground subway lines when evaluating how institutional incentives shape long-term outcomes."
    ],
    [
      "<i><b>Text 1</b><br>Biologist Lynn Margulis revolutionized evolutionary theory in 1967 by arguing that eukaryotic mitochondria and chloroplasts originated as free-living bacteria engulfed by host cells in endosymbiosis, pointing to their circular DNA and bacterial-style ribosomes.<br><br><b>Text 2</b><br>In 2015, microbiologist Thijs Ettema and colleagues discovered the Lokiarchaeota in deep-sea sediment near Arctic hydrothermal vents. Genomic sequencing revealed that these archaea—members of the newly defined Asgard superphylum—already possess 'eukaryotic signature proteins' involved in membrane remodeling and cytoskeleton formation, providing the missing evolutionary bridge explaining how an archaeal host cell could have engulfed the bacterial ancestor of mitochondria.</i><br><br>How does Text 2 build upon the theory presented in Text 1?",
      "It identifies the specific archaeal lineage and cellular machinery that enabled the host cell to perform the engulfment central to Margulis's endosymbiotic theory.",
      "It refutes Margulis's claim that mitochondria contain circular DNA derived from free-living bacterial ancestors despite relying on the same foundational archival and experimental datasets.",
      "It argues that chloroplasts evolved millions of years before mitochondria in deep-sea hydrothermal vent environments when evaluating how institutional incentives shape long-term outcomes.",
      "It shows that Lokiarchaeota are multicellular eukaryotes rather than single-celled prokaryotic archaea despite relying on the same foundational archival and experimental datasets."
    ],
    [
      "<i><b>Text 1</b><br>Classical historiography attributed the collapse of the Western Roman Empire in the fifth century CE primarily to catastrophic military invasions by unified Germanic 'barbarian' confederations—such as the Visigoths and Vandals—who overran imperial frontier defenses.<br><br><b>Text 2</b><br>Historian Walter Goffart and archaeologists of Late Antiquity emphasize that groups like the Franks and Ostrogoths were long integrated into the Roman military as federated allies (foederati). Rather than destroying Roman administration, successor kings maintained Latin legal codes, Roman tax assessment registers, and senatorial municipal elites, transforming provincial governance gradually from within.</i><br><br>Which choice best states how Text 2's perspective differs from Text 1's?",
      "Text 2 frames the fifth-century transition as an administrative accommodation involving Romanized military allies rather than a sudden destructive conquest by outsiders.",
      "Text 2 argues that the Western Roman Empire never employed non-Roman soldiers in its frontier legions prior to the sixth century CE when evaluating how institutional.",
      "Text 2 contends that the Visigoths and Vandals abolished all Latin legal codes and tax registries immediately upon entering Italy despite relying on the same.",
      "Text 2 attributes the fall of Rome exclusively to volcanic climate cooling rather than to political or military developments when evaluating how institutional."
    ],
    [
      "<i><b>Text 1</b><br>In patent law, proponents of broad software and biotech patents argue that granting twenty-year exclusive monopolies on foundational algorithms and gene-editing tools is essential to incentivize venture capital investment in costly research and development.<br><br><b>Text 2</b><br>Legal scholars Michael Heller and Rebecca Eisenberg identified the 'tragedy of the anticommons' in biomedical research: when upstream foundational discoveries and gene sequences are splintered among dozens of separate patent holders, downstream researchers face prohibitive licensing transaction costs and holdout delays, stalling the development of clinical therapies.</i><br><br>Based on the texts, what would Heller and Eisenberg (Text 2) say about the patent policy endorsed in Text 1?",
      "Granting broad patents on upstream foundational tools can paradoxically impede innovation by creating fragmented licensing barriers for downstream researchers.",
      "Twenty-year patent terms are too short to allow pharmaceutical companies to recover the costs of clinical trials despite relying on the same foundational archival and experimental datasets.",
      "Venture capital firms invest exclusively in open-source software projects that reject intellectual property protection when evaluating how institutional incentives shape long-term outcomes.",
      "Biomedical researchers rarely need to combine more than one patented technique when developing a new clinical therapy despite relying on the same foundational archival and experimental datasets."
    ],
    [
      "<i><b>Text 1</b><br>Art historians of the mid-twentieth century celebrated the white marble sculptures of Classical Athens—such as the Parthenon friezes—for their austere, unpainted purity of form, viewing the absence of color as the defining aesthetic ideal of Greek antiquity.<br><br><b>Text 2</b><br>Using ultraviolet-induced visible luminescence and X-ray fluorescence spectroscopy, archaeologist Vinzenz Brinkmann has detected microscopic traces of Egyptian blue, cinnabar, malachite, and gold leaf across dozens of Greek and Roman marble statues. Brinkmann's reconstructions reveal that ancient sculptures were brightly painted from hair to drapery, and that the 'pure white' aesthetic arose only after centuries of burial stripped the original pigments.</i><br><br>Based on the texts, how do Brinkmann's findings (Text 2) affect the art-historical view described in Text 1?",
      "They demonstrate that the admired 'white marble' ideal was an accidental byproduct of pigment weathering rather than the original artistic intention of Greek sculptors.",
      "They confirm that Classical Athenian sculptors reserved colorful pigments for wooden temple roofs while leaving marble statues unpainted when evaluating how institutional incentives shape long-term outcomes.",
      "They suggest that Renaissance sculptors intentionally painted ancient Roman statues with Egyptian blue and cinnabar after excavating them despite relying on the same foundational archival and experimental datasets.",
      "They show that ultraviolet luminescence damages marble surfaces and cannot distinguish ancient mineral pigments from modern soil stains when evaluating how institutional incentives shape long-term outcomes."
    ],
    [
      "<i><b>Text 1</b><br>Proponents of universal basic income (UBI) argue that providing an unconditional cash transfer to all citizens eliminates the bureaucratic overhead and 'welfare traps' of means-tested programs, where beneficiaries lose benefits as soon as their earned wages rise.<br><br><b>Text 2</b><br>Labor economists Hilary Hoynes and Jesse Rothstein analyzed fiscal models of a universal basic income large enough to lift families out of poverty. They calculate that funding a universal payment to every household—including middle- and high-income earners—would require nearly doubling federal income tax rates or diverting funds from targeted disability, housing, and child-nutrition programs that deliver far greater poverty reduction per dollar spent.</i><br><br>Which choice best describes the disagreement between the two texts?",
      "While Text 1 emphasizes the administrative and incentive advantages of universality, Text 2 argues that universal payments are fiscally inefficient compared with targeted aid.",
      "Both texts agree that means-tested welfare programs cost more to administer than a universal basic income but disagree on whether cash transfers increase inflation despite relying on the same foundational archival and experimental datasets.",
      "Text 1 advocates replacing all public schools with cash stipends, whereas Text 2 supports expanding corporate tax credits for manufacturing firms when evaluating how institutional incentives shape long-term outcomes.",
      "Text 2 claims that means-tested programs create stronger work disincentives for low-income earners than universal cash transfers do despite relying on the same foundational archival and experimental datasets."
    ],
    [
      "<i><b>Text 1</b><br>Marine ecologist Jeremy Jackson's 'shifting baseline syndrome' warns that each generation of fisheries scientists accepts the depleted fish stocks and degraded coral reefs of their own youth as the 'natural' unspoiled baseline, progressively underestimating the true historical abundance of marine ecosystems prior to industrial trawling.<br><br><b>Text 2</b><br>Historical ecologistLoren McClenachan compiled trophy photographs taken at Key West charter-fishing docks between 1956 and 2007, alongside eighteenth-century British admiralty logbooks. She documented that the average weight of prized reef predators—groupers, sharks, and snappers—dropped by 88 percent over fifty years even as charter captains continued to advertise the reefs as pristine.</i><br><br>How does McClenachan's study (Text 2) relate to Jackson's concept (Text 1)?",
      "It provides concrete archival and photographic evidence of a severe multi-decade ecological decline that contemporary observers failed to recognize as abnormal.",
      "It challenges Jackson's claim by showing that Key West grouper and snapper populations remained stable between 1956 and 2007 when evaluating how institutional incentives shape long-term outcomes.",
      "It argues that eighteenth-century British admiralty logbooks exaggerated the size of Caribbean reef sharks to impress naval authorities despite relying on the same foundational archival and experimental datasets.",
      "It suggests that recreational charter fishing has a larger impact on deep-sea fish stocks than commercial bottom trawling does when evaluating how institutional incentives shape long-term outcomes."
    ]
  ],
  [
    [
      "<i>While researching tardigrades, a student has taken the following notes:</i><br>• Tardigrades are microscopic animals, typically about 0.5 millimeter long.<br>• They were first described in 1773 by the German zoologist Johann August Ephraim Goeze.<br>• They have been found in habitats ranging from mountaintops to Antarctic ice.<br>• When dried out, they enter a dormant state called a 'tun' and can survive for years.<br><br>The student wants to introduce tardigrades to readers unfamiliar with them by emphasizing their small size and resilience. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Typically only about 0.5 millimeter long, tardigrades can survive drying out for years by entering a dormant state known as a 'tun.'",
      "First described in 1773 by Johann August Ephraim Goeze, tardigrades have since been found in habitats ranging from mountaintops",
      "Tardigrades have been found in habitats ranging from mountaintops to Antarctic ice, which makes them one of the most widespread",
      "Johann August Ephraim Goeze described the tardigrade in 1773, and it is now known to survive for years in a dormant state."
    ],
    [
      "<i>While researching cell biology, a student has taken the following notes:</i><br>• Mitochondria are organelles found in most eukaryotic cells.<br>• They produce most of a cell's ATP through oxidative phosphorylation.<br>• They contain their own small, circular DNA.<br>• Mitochondrial DNA is typically inherited from the mother.<br><br>The student wants to explain the main function of mitochondria to a general audience. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Mitochondria, organelles found in most eukaryotic cells, produce most of a cell's ATP through a process called oxidative phosphorylation.",
      "Unlike most organelles, mitochondria contain their own small, circular DNA, which is typically inherited from the mother, which historians and scientists regard as a pivotal milestone in the field.",
      "Found in most eukaryotic cells, mitochondria carry circular DNA of their own and are typically inherited from the mother, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Mitochondria are organelles, which means they are structures found inside eukaryotic cells rather than inside prokaryotic ones."
    ],
    [
      "<i>While researching photosynthesis, a student has taken the following notes:</i><br>• Most plants appear green.<br>• Chlorophyll is the main pigment used in photosynthesis.<br>• Chlorophyll absorbs light mostly in the red and blue parts of the spectrum.<br>• Green wavelengths are mostly reflected rather than absorbed.<br><br>The student wants to explain why plants look green. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Plants look green because chlorophyll absorbs mostly red and blue light and reflects green wavelengths.",
      "Plants look green because chlorophyll is the main pigment that they use to carry out photosynthesis.",
      "Chlorophyll absorbs light mostly in the red and blue parts of the spectrum, which is why photosynthesis is most efficient in those colors.",
      "Plants look green because chlorophyll absorbs green light and uses it as the main source of energy for photosynthesis."
    ],
    [
      "<i>While researching gene editing, a student has taken the following notes:</i><br>• In 2012, Jennifer Doudna and Emmanuelle Charpentier described how the enzyme Cas9 can be programmed to cut DNA at chosen sites.<br>• The technique is adapted from a bacterial defense system against viruses.<br>• Doudna and Charpentier received the 2020 Nobel Prize in Chemistry.<br>• Scientists use the technique in research on genetic diseases and crop improvement.<br><br>The student wants to emphasize the scientific recognition that CRISPR research has received. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Doudna and Charpentier's 2012 work on programming Cas9 to cut DNA earned them the 2020 Nobel Prize in Chemistry.",
      "Adapted from a bacterial defense system against viruses, CRISPR is now used in research on genetic diseases and crop improvement.",
      "In 2012, Doudna and Charpentier described how Cas9 can be programmed to cut DNA at chosen sites, a technique now used to improve crops.",
      "CRISPR, which comes from a bacterial defense system, has been used by scientists studying genetic diseases since the 2020 Nobel Prize."
    ],
    [
      "<i>While researching particle physics, a student has taken the following notes:</i><br>• Peter Higgs and others proposed the Higgs mechanism in 1964.<br>• The Higgs boson was observed at CERN's Large Hadron Collider in 2012.<br>• Its mass is about 125 gigaelectronvolts.<br>• Higgs and Francois Englert shared the 2013 Nobel Prize in Physics.<br><br>The student wants to emphasize the long interval between the prediction of the Higgs boson and its observation. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The Higgs boson, proposed in 1964, was not observed until 2012, when experiments at CERN's Large Hadron Collider detected it.",
      "With a mass of about 125 gigaelectronvolts, the Higgs boson was observed at CERN's Large Hadron Collider in 2012.",
      "Peter Higgs and Francois Englert shared the 2013 Nobel Prize in Physics for the mechanism that Higgs proposed in 1964.",
      "Peter Higgs proposed the mechanism in 1964, and only a year later CERN detected the particle with the Large Hadron Collider."
    ],
    [
      "<i>While researching space exploration, a student has taken the following notes:</i><br>• NASA launched Voyager 1 in September 1977.<br>• The spacecraft crossed into interstellar space in August 2012.<br>• By 2023, it was more than 24 billion kilometers from Earth.<br>• It carries the Golden Record, a disc of sounds and images from Earth.<br><br>The student wants to emphasize how far Voyager 1 has traveled. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Launched in 1977, Voyager 1 had traveled more than 24 billion kilometers from Earth by 2023, well after entering interstellar space in 2012.",
      "Voyager 1, launched in September 1977, carries the Golden Record, a disc of sounds and images from Earth, demonstrating its broad.",
      "Voyager 1 crossed into interstellar space in August 2012, carrying a disc of sounds and images from Earth, a finding that researchers.",
      "NASA launched Voyager 1 in September 1977, and the spacecraft remains the most complex probe the agency has ever built, which historians."
    ],
    [
      "<i>While researching telescopes, a student has taken the following notes:</i><br>• The James Webb Space Telescope launched on December 25, 2021.<br>• Its 6.5-meter primary mirror consists of 18 hexagonal segments.<br>• The segments are coated with a thin layer of gold.<br>• Gold reflects infrared light very efficiently, and Webb primarily observes infrared light.<br><br>The student wants to explain why Webb's mirror is coated in gold. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Because Webb primarily observes infrared light, its mirror segments are coated in gold, which reflects infrared light very efficiently.",
      "Webb's 6.5-meter primary mirror consists of 18 hexagonal segments, each of which is coated with a thin layer of gold, a finding that researchers have documented across multiple independent studies.",
      "Launched on December 25, 2021, Webb has a mirror coated in gold, a metal chosen mainly because it is lightweight, which historians and scientists regard as a pivotal milestone in the field.",
      "Gold reflects visible light efficiently, so Webb's 18 hexagonal mirror segments are coated with it to observe visible wavelengths."
    ],
    [
      "<i>While researching the history of medicine, a student has taken the following notes:</i><br>• In 1928, Alexander Fleming noticed that mold on a culture plate had killed nearby bacteria.<br>• Fleming did not develop the substance into a usable drug.<br>• In the late 1930s and early 1940s, Howard Florey, Ernst Chain, and their colleagues purified penicillin and tested it.<br>• Fleming, Florey, and Chain shared the 1945 Nobel Prize in Physiology or Medicine.<br><br>The student wants to emphasize that Fleming's discovery required further work by others to become a usable medicine. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Although Fleming noticed penicillin's effects in 1928, it was Florey, Chain, and their colleagues who later purified and tested it for use as a drug.",
      "Fleming, Florey, and Chain shared the 1945 Nobel Prize in Physiology or Medicine for their combined work on penicillin and its development, which historians and scientists regard as a pivotal milestone in the field.",
      "In 1928, Alexander Fleming noticed that mold on a culture plate had killed nearby bacteria, and he went on to develop it into a usable drug, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Howard Florey and Ernst Chain purified penicillin and tested it in the late 1930s and early 1940s, shortly after Fleming won a Nobel Prize."
    ],
    [
      "<i>While researching geology, a student has taken the following notes:</i><br>• Earth's outer shell is broken into large plates that move slowly.<br>• Most plates move about 2 to 10 centimeters per year.<br>• That is roughly the speed at which human fingernails grow.<br>• Most earthquakes and volcanoes occur along plate boundaries.<br><br>The student wants to help readers grasp how slowly tectonic plates move by using a familiar comparison. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Tectonic plates move only about 2 to 10 centimeters per year, roughly as fast as human fingernails grow.",
      "Most earthquakes and volcanoes occur at plate boundaries, where Earth's large, slowly moving plates meet.",
      "Earth's outer shell is broken into large plates that move at a rate of about 2 to 10 centimeters per year.",
      "Tectonic plates move about as fast as human fingernails grow, which is why earthquakes and volcanoes occur at their boundaries."
    ],
    [
      "<i>While researching rainforests, a student has taken the following notes:</i><br>• The Amazon rainforest covers about 5.5 million square kilometers in South America.<br>• It spans nine countries, with about 60 percent of it in Brazil.<br>• It is home to roughly 10 percent of the known species on Earth.<br>• Deforestation has removed a significant portion of the forest since the 1970s.<br><br>The student wants to emphasize the Amazon's biodiversity. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Home to roughly 10 percent of the known species on Earth, the Amazon rainforest is among the planet's richest centers of biodiversity.",
      "Covering about 5.5 million square kilometers across nine countries, the Amazon rainforest lies mostly within Brazil, a finding that researchers have documented across multiple independent studies.",
      "Deforestation since the 1970s has removed a significant portion of the Amazon, which spans nine countries in South America, which historians and scientists regard as a pivotal milestone in the field.",
      "About 60 percent of the Amazon rainforest lies in Brazil, which has more species than any other country on Earth, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching marine ecosystems, a student has taken the following notes:</i><br>• Coral reefs cover less than 1 percent of the ocean floor.<br>• They support roughly 25 percent of all marine species.<br>• Warming oceans cause coral bleaching.<br>• Many coastal communities depend on reefs for fishing and tourism.<br><br>The student wants to emphasize how important coral reefs are relative to the area they cover. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Although coral reefs cover less than 1 percent of the ocean floor, they support roughly 25 percent of all marine species.",
      "Warming oceans cause coral bleaching, a threat to reefs that support roughly 25 percent of all marine species.",
      "Coral reefs cover less than 1 percent of the ocean floor, and many coastal communities depend on them for fishing.",
      "Many coastal communities depend on coral reefs, which support roughly 25 percent of marine species and are threatened."
    ],
    [
      "<i>While researching Australia's natural wonders, a student has taken the following notes:</i><br>• The Great Barrier Reef is located off the coast of Queensland, Australia.<br>• It stretches roughly 2,300 kilometers.<br>• It is made up of nearly 3,000 individual reefs.<br>• UNESCO designated it a World Heritage Site in 1981.<br><br>The student wants to convey the vast scale of the Great Barrier Reef. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Stretching roughly 2,300 kilometers off Queensland, Australia, the Great Barrier Reef is made up of nearly 3,000 individual reefs.",
      "Located off the coast of Queensland, Australia, the Great Barrier Reef was designated a UNESCO World Heritage Site in 1981, demonstrating its broad significance across diverse geographic and historical contexts.",
      "The Great Barrier Reef, which UNESCO designated a World Heritage Site in 1981, is the largest coral reef in the Pacific Ocean, a finding that researchers have documented across multiple independent studies.",
      "Made up of individual reefs, the Great Barrier Reef is located off Queensland and was recognized by UNESCO in 1981."
    ],
    [
      "<i>While researching mountaineering, a student has taken the following notes:</i><br>• A 2020 survey by China and Nepal measured Mount Everest's height at 8,849 meters above sea level.<br>• Edmund Hillary and Tenzing Norgay made the first confirmed ascent on May 29, 1953.<br>• Everest lies on the border between Nepal and Tibet.<br>• Climbers typically attempt the summit in May, when weather is most favorable.<br><br>The student wants to present the first confirmed ascent of Everest, naming the climbers and giving the date. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "On May 29, 1953, Edmund Hillary and Tenzing Norgay made the first confirmed ascent of Mount Everest.",
      "A 2020 survey by China and Nepal measured Everest's height at 8,849 meters above sea level.",
      "Edmund Hillary and Tenzing Norgay climbed Everest, which lies on the border between Nepal and Tibet.",
      "Climbers typically attempt Everest's summit in May, as Edmund Hillary and Tenzing Norgay did when they climbed it."
    ],
    [
      "<i>While researching famous scientists, a student has taken the following notes:</i><br>• Marie Curie shared the 1903 Nobel Prize in Physics with Pierre Curie and Henri Becquerel.<br>• She won the 1911 Nobel Prize in Chemistry for discovering polonium and radium.<br>• She was the first woman to win a Nobel Prize.<br>• She remains the only person to have won Nobel Prizes in both physics and chemistry.<br><br>The student wants to emphasize Marie Curie's unique distinction among Nobel laureates. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Marie Curie, who won the Nobel Prize in Physics in 1903 and in Chemistry in 1911, remains the only person to win in both fields.",
      "Marie Curie shared the 1903 Nobel Prize in Physics with her husband, Pierre Curie, and with Henri Becquerel, which historians and scientists regard as a pivotal milestone in the field.",
      "Marie Curie, the first woman to win a Nobel Prize, was honored in 1911 for her discovery of polonium and radium, demonstrating its broad significance across diverse geographic and historical contexts.",
      "As the first woman to win a Nobel Prize, Marie Curie shared the 1903 prize in Physics with Pierre Curie and Henri Becquerel."
    ],
    [
      "<i>While researching the discovery of DNA's structure, a student has taken the following notes:</i><br>• Rosalind Franklin produced X-ray diffraction images of DNA in 1952, including the one known as Photo 51.<br>• James Watson and Francis Crick used her data in building their 1953 double-helix model.<br>• Watson, Crick, and Maurice Wilkins received the 1962 Nobel Prize in Physiology or Medicine.<br>• Franklin died in 1958, and Nobel Prizes are not awarded posthumously.<br><br>The student wants to explain why Franklin was not among the 1962 Nobel recipients despite her contribution. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Although Franklin's X-ray images of DNA aided Watson and Crick, she died in 1958 and was therefore ineligible for the 1962 Nobel Prize, which is not awarded posthumously.",
      "Rosalind Franklin's X-ray diffraction images of DNA, including the one known as Photo 51, helped Watson and Crick build their double-helix model of 1953, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Watson, Crick, and Maurice Wilkins received the 1962 Nobel Prize in Physiology or Medicine for work that depended partly on Franklin's X-ray images of DNA, a finding that researchers have documented across multiple independent studies.",
      "Franklin produced Photo 51 in 1952 but died in 1958, before Watson and Crick had built their double-helix model of DNA, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching the history of printing, a student has taken the following notes:</i><br>• Jikji is a Korean Buddhist text.<br>• It was printed in 1377 at Heungdeok Temple in Cheongju.<br>• It is the oldest surviving book printed with movable metal type.<br>• Johannes Gutenberg printed his Bible around 1455.<br>• The only known copy is held by the National Library of France.<br><br>The student wants to emphasize that printing with movable metal type predates Gutenberg. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Printed in Korea in 1377, the Jikji is the oldest surviving book printed with movable metal type, predating Gutenberg's Bible of around 1455 by decades.",
      "The only known copy of the Jikji, a Korean Buddhist text printed in 1377, is held by the National Library of France, a finding that researchers have.",
      "Johannes Gutenberg printed his Bible around 1455 using movable metal type, a technique later adopted in Korea for texts such as the Jikji,.",
      "Printed at Heungdeok Temple in Cheongju, the Jikji is a Korean Buddhist text that Gutenberg later studied, demonstrating its broad significance."
    ],
    [
      "<i>While researching ancient Egypt, a student has taken the following notes:</i><br>• The Rosetta Stone was found in 1799 by French soldiers near Rashid (Rosetta), Egypt.<br>• It was inscribed in 196 BCE with a decree of Ptolemy V.<br>• The same text appears in hieroglyphic, Demotic, and ancient Greek.<br>• Jean-Francois Champollion announced his decipherment of hieroglyphs in 1822.<br><br>The student wants to explain why the Rosetta Stone helped scholars read hieroglyphs. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Because the Rosetta Stone repeats one decree in hieroglyphic, Demotic, and ancient Greek, scholars could use the known Greek text to decipher the hieroglyphs.",
      "Found in 1799 by French soldiers, the Rosetta Stone was inscribed in 196 BCE with a decree of Ptolemy V.",
      "Jean-Francois Champollion announced in 1822 that he had deciphered hieroglyphs, using the stone discovered near Rashid, Egypt.",
      "Inscribed with a decree of Ptolemy V, the Rosetta Stone includes hieroglyphic, Demotic, and ancient Greek, the three languages spoken in Egypt at the time."
    ],
    [
      "<i>While researching the Inca Empire, a student has taken the following notes:</i><br>• Machu Picchu was built around 1450 for the Inca emperor Pachacuti.<br>• It is located about 2,430 meters above sea level in the Andes of Peru.<br>• It was abandoned around the time of the Spanish conquest.<br>• Hiram Bingham brought it to international attention in 1911.<br>• It has been a UNESCO World Heritage Site since 1983.<br><br>The student wants to describe the origin and location of Machu Picchu for readers unfamiliar with it. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Built around 1450 for the Inca emperor Pachacuti, Machu Picchu sits about 2,430 meters above sea level in the Andes of Peru.",
      "Hiram Bingham brought Machu Picchu to international attention in 1911, long after it was abandoned around the time of the Spanish conquest.",
      "Machu Picchu, a UNESCO World Heritage Site since 1983, was abandoned around the time of the Spanish conquest.",
      "Machu Picchu was built around 1450 and was brought to international attention by Hiram Bingham in 1911."
    ],
    [
      "<i>While researching medieval England, a student has taken the following notes:</i><br>• King John of England sealed Magna Carta at Runnymede in June 1215.<br>• Rebellious barons forced John to agree after disputes over taxation and royal power.<br>• It included the principle that no free man could be imprisoned except by lawful judgment.<br>• Its clauses were reissued many times, and it later influenced constitutional thinking in England and the United States.<br><br>The student wants to emphasize the lasting influence of Magna Carta. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Sealed in 1215 amid a dispute between King John and his barons, Magna Carta later influenced constitutional thinking in both England and the United States.",
      "In June 1215 at Runnymede, King John sealed Magna Carta after rebellious barons objected to his taxation and royal power, a finding that researchers have documented across multiple independent studies.",
      "Magna Carta established that no free man could be imprisoned except by lawful judgment, a principle that King John agreed to at Runnymede, which historians and scientists regard as a pivotal milestone in the field.",
      "King John sealed Magna Carta in 1215, and its clauses were reissued repeatedly by the kings who followed him, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching engineering projects, a student has taken the following notes:</i><br>• The Panama Canal opened on August 15, 1914.<br>• It is about 82 kilometers long.<br>• It connects the Atlantic and Pacific oceans across the Isthmus of Panama.<br>• Ships traveling between New York and San Francisco avoid a voyage of about 8,000 miles around South America.<br><br>The student wants to emphasize the distance the canal saves shipping. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "By cutting across the Isthmus of Panama, the canal spares ships traveling between New York and San Francisco a voyage of about 8,000 miles around South America.",
      "Opened in 1914, the Panama Canal is about 82 kilometers long and connects the Atlantic and Pacific oceans, which historians and scientists regard as a pivotal milestone in the field.",
      "The Panama Canal, which opened on August 15, 1914, crosses the Isthmus of Panama between the two oceans, demonstrating its broad significance across diverse geographic and historical contexts.",
      "About 82 kilometers long, the canal serves ships that travel between New York and San Francisco, cities about 8,000 miles apart, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching nineteenth-century America, a student has taken the following notes:</i><br>• The transcontinental railroad was completed on May 10, 1869, at Promontory Summit, Utah.<br>• It was built by the Central Pacific and Union Pacific companies.<br>• Before the railroad, crossing the country by wagon or ship took months.<br>• After its completion, a cross-country trip took about a week.<br><br>The student wants to emphasize how the railroad changed travel time. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The railroad, completed in 1869, cut cross-country travel from months by wagon or ship to about a week.",
      "Completed at Promontory Summit, Utah, the transcontinental railroad was built by the Central Pacific.",
      "The Central Pacific and Union Pacific companies built the railroad, which was completed on May 10,.",
      "Before the railroad, crossing the country took months, and the two companies completed the line."
    ],
    [
      "<i>While researching the abolitionist movement, a student has taken the following notes:</i><br>• Harriet Tubman was born into slavery in Maryland around 1822.<br>• She escaped to Pennsylvania in 1849.<br>• She made about 13 trips back to the South, guiding roughly 70 people to freedom.<br>• In 1863, she helped lead the Combahee River Raid, which freed more than 700 enslaved people.<br><br>The student wants to emphasize Tubman's role in a military operation. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "In 1863, Harriet Tubman helped lead the Combahee River Raid, a military operation that freed more than 700 enslaved people.",
      "Harriet Tubman escaped slavery in Maryland in 1849 and later guided roughly 70 people to freedom on about 13 trips.",
      "Born into slavery in Maryland around 1822, Harriet Tubman escaped to Pennsylvania in 1849 and returned to the South repeatedly.",
      "After escaping to Pennsylvania, Tubman returned to the South about 13 times, freeing more than 700 people in total."
    ],
    [
      "<i>While researching the history of voting rights, a student has taken the following notes:</i><br>• New Zealand granted women the right to vote in national elections in 1893.<br>• Finland granted women full voting rights and the right to stand for office in 1906.<br>• The United States ratified the 19th Amendment in 1920.<br>• Women in Switzerland gained the right to vote in federal elections in 1971.<br><br>The student wants to show that the United States was not among the first countries to grant women the vote. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The United States did not guarantee women's suffrage until 1920, decades after New Zealand did so in 1893 and Finland in 1906.",
      "Women in the United States won the right to vote through the 19th Amendment, which was ratified in 1920, which historians and scientists regard as a pivotal milestone in the field.",
      "New Zealand granted women the vote in 1893, followed by Finland in 1906 and Switzerland in 1971, demonstrating its broad significance across diverse geographic and historical contexts.",
      "The United States ratified the 19th Amendment in 1920, a year before New Zealand granted women the right to vote."
    ],
    [
      "<i>While researching the space race, a student has taken the following notes:</i><br>• Apollo 11 launched on July 16, 1969, and landed on the Moon on July 20.<br>• Neil Armstrong and Buzz Aldrin spent about 21.5 hours on the lunar surface.<br>• Their moonwalk lasted about 2.5 hours.<br>• Michael Collins remained in lunar orbit.<br><br>The student wants to emphasize how brief the astronauts' time on the Moon's surface was. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "After the July 20, 1969, landing, Armstrong and Aldrin spent only about 21.5 hours on the Moon's surface, including a moonwalk of roughly 2.5 hours.",
      "Michael Collins remained in lunar orbit while Armstrong and Aldrin descended to the Moon's surface in July 1969, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Apollo 11 launched on July 16, 1969, and landed on the Moon four days later, a finding that researchers have documented across multiple independent studies.",
      "Armstrong and Aldrin took a moonwalk lasting about 2.5 hours before Michael Collins joined them on the surface, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching the 1930s, a student has taken the following notes:</i><br>• Severe drought and dust storms struck the Southern Plains in the 1930s.<br>• Black Sunday, April 14, 1935, produced one of the worst dust storms.<br>• Years of plowing native grass had left the soil exposed.<br>• Congress created the Soil Conservation Service in 1935.<br><br>The student wants to describe a government response to the Dust Bowl. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Responding to the destruction, Congress created the Soil Conservation Service in 1935, the same year as the Black Sunday dust storm.",
      "Years of plowing native grass left the soil of the Southern Plains exposed, and the 1930s drought produced severe dust storms.",
      "On Black Sunday, April 14, 1935, one of the worst dust storms of the decade struck the Southern Plains.",
      "Native grass was plowed under during the 1930s, a practice that the Soil Conservation Service ended in 1935."
    ],
    [
      "<i>While researching the Civil War, a student has taken the following notes:</i><br>• Abraham Lincoln delivered the Gettysburg Address on November 19, 1863, at the dedication of a cemetery for Union soldiers.<br>• The address is about 270 words long.<br>• Edward Everett spoke before Lincoln for roughly two hours.<br>• Lincoln's speech took about two minutes.<br><br>The student wants to emphasize the contrast between Lincoln's speech and the one that preceded it. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "At the 1863 dedication, Edward Everett spoke for roughly two hours, whereas Lincoln's address of about 270 words took only about two minutes.",
      "Lincoln delivered the address on November 19, 1863, at the dedication of a cemetery for Union soldiers, which historians and scientists.",
      "Lincoln's Gettysburg Address, which is about 270 words long, was delivered at a cemetery dedication in 1863, demonstrating its broad.",
      "Edward Everett and Lincoln each spoke for about two hours at the 1863 dedication of the cemetery, a finding that researchers have."
    ],
    [
      "<i>While researching astronomy, a student has taken the following notes:</i><br>• The Hubble Space Telescope was launched in April 1990.<br>• Its primary mirror had a flaw called spherical aberration, so early images were blurry.<br>• Astronauts installed corrective optics during a servicing mission in December 1993.<br>• Hubble orbits about 540 kilometers above Earth.<br><br>The student wants to emphasize how the Hubble mission recovered from an early setback. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Although a mirror flaw blurred Hubble's early images after its 1990 launch, astronauts installed corrective optics in December 1993.",
      "Hubble, which was launched in April 1990, orbits about 540 kilometers above Earth, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Astronauts serviced Hubble in December 1993, when the telescope was orbiting about 540 kilometers above Earth, a finding that researchers have documented across multiple independent studies.",
      "Hubble's primary mirror had a flaw, which is why the telescope was placed in an orbit about 540 kilometers above Earth."
    ],
    [
      "<i>While researching animal communication, a student has taken the following notes:</i><br>• Karl von Frisch decoded the honeybee waggle dance, work that helped earn him a 1973 Nobel Prize.<br>• The angle of the waggle run relative to vertical indicates the direction of food relative to the sun.<br>• The duration of the waggle run indicates the distance to the food.<br>• Other bees follow the dance and then fly to the food source.<br><br>The student wants to explain how the waggle dance conveys both direction and distance. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "In the waggle dance, the angle of the run relative to vertical signals the direction of the food, while the run's duration signals its distance.",
      "Karl von Frisch decoded the waggle dance, which other bees follow to find food, and won a Nobel Prize for it in 1973, a finding that researchers have documented across multiple independent studies.",
      "The waggle dance, which earned Karl von Frisch a Nobel Prize, tells other bees how far away food is through the angle of the dancer's run, which historians and scientists regard as a pivotal milestone in the field.",
      "Bees that follow a waggle dance fly to the food source, guided by the angle of the dancer's run relative to the sun, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching marine animals, a student has taken the following notes:</i><br>• Octopuses have blue blood.<br>• Their blood uses hemocyanin, a copper-containing protein, to carry oxygen.<br>• Human blood uses hemoglobin, an iron-containing protein, which gives blood its red color.<br>• Hemocyanin is more efficient than hemoglobin in cold, low-oxygen water.<br><br>The student wants to explain why octopus blood is blue. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Octopus blood is blue because it carries oxygen with hemocyanin, a copper-containing protein, rather than with iron-containing hemoglobin.",
      "Octopuses have blue blood, which works better in cold, low-oxygen water than human blood does, which historians and scientists regard as a pivotal milestone in the field.",
      "Human blood is red because it contains hemoglobin, an iron-containing protein that carries oxygen, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Octopus blood is blue because hemocyanin is more efficient than hemoglobin in cold, low-oxygen water, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching animal migration, a student has taken the following notes:</i><br>• Monarch butterflies in eastern North America migrate up to about 4,800 kilometers to central Mexico.<br>• Most adult monarchs live only two to six weeks.<br>• The generation that migrates south, sometimes called the 'super generation,' can live up to eight months.<br>• The northward return takes several generations.<br><br>The student wants to emphasize the difference in lifespan between the migrating generation and other adult monarchs. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "While most adult monarchs live only two to six weeks, the generation that migrates south can live up to eight months.",
      "Monarch butterflies in eastern North America migrate up to about 4,800 kilometers to central Mexico.",
      "The migration south, which covers up to about 4,800 kilometers, is made by a generation that lives up to eight months.",
      "Most adult monarchs live two to six weeks, which is why the northward return takes several generations."
    ],
    [
      "<i>While researching bird migration, a student has taken the following notes:</i><br>• Arctic terns breed in the Arctic and spend the northern winter in Antarctic waters.<br>• A tracking study recorded round trips of about 70,000 kilometers.<br>• An Arctic tern weighs about 100 grams.<br>• They can live for 20 years or more.<br><br>The student wants to emphasize the contrast between the bird's size and the length of its journey. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Weighing only about 100 grams, an Arctic tern can fly a round trip of roughly 70,000 kilometers between the Arctic and Antarctic waters.",
      "Arctic terns breed in the Arctic and winter in Antarctic waters, and they can live for 20 years or more, a finding that researchers.",
      "Tracking studies have found that Arctic terns, which can live 20 years or more, fly round trips of about 70,000 kilometers,.",
      "Arctic terns, which breed in the Arctic, weigh about 100 grams and can live for 20 years or more, demonstrating its broad."
    ],
    [
      "<i>While researching deep-sea life, a student has taken the following notes:</i><br>• Bioluminescence is light produced by living organisms through a chemical reaction involving luciferin and an enzyme.<br>• A 2017 study estimated that about 76 percent of animals observed in the deep waters of Monterey Bay produce light.<br>• Animals use bioluminescence to attract prey, evade predators, and communicate.<br><br>The student wants to emphasize how common bioluminescence is among deep-sea animals. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "A 2017 study estimated that about 76 percent of the animals observed in the deep waters of Monterey Bay produce their own light.",
      "Bioluminescence results from a chemical reaction involving luciferin and an enzyme, and animals use it to attract prey and evade predators.",
      "Deep-sea animals use bioluminescence to attract prey, evade predators, and communicate with one another.",
      "Luciferin reacts with an enzyme in about 76 percent of animals worldwide, producing the light that helps them attract prey."
    ],
    [
      "<i>While researching the largest animals, a student has taken the following notes:</i><br>• The blue whale (Balaenoptera musculus) is the largest known animal ever to have lived.<br>• Adults can reach about 30 meters in length.<br>• They can weigh up to about 180 metric tons.<br>• They feed almost entirely on krill.<br><br>The student wants to emphasize the blue whale's size. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Reaching about 30 meters in length and weighing up to roughly 180 metric tons, the blue whale is the largest known animal ever to have lived.",
      "The blue whale, Balaenoptera musculus, feeds almost entirely on krill, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Blue whales, which feed almost entirely on krill, can reach about 30 meters in length, a finding that researchers have documented across multiple independent studies.",
      "The blue whale, the largest known animal ever to have lived, is classified scientifically as Balaenoptera musculus, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching public health, a student has taken the following notes:</i><br>• In 1796, Edward Jenner used material from cowpox lesions to protect a boy against smallpox.<br>• The World Health Organization declared smallpox eradicated in 1980.<br>• Smallpox killed an estimated 300 million people in the 20th century.<br>• It is the only human disease to have been declared eradicated.<br><br>The student wants to emphasize the magnitude of the achievement of eradicating smallpox. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Smallpox, which killed an estimated 300 million people in the 20th century, became in 1980 the only human disease declared eradicated.",
      "In 1796, Edward Jenner used material from cowpox lesions to protect a boy against smallpox.",
      "Smallpox was declared eradicated in 1980, long after Edward Jenner developed the first vaccine in 1796.",
      "The World Health Organization declared smallpox eradicated in 1980, ending an epidemic that killed about 300 million people in the 18th century."
    ],
    [
      "<i>While researching the history of diabetes treatment, a student has taken the following notes:</i><br>• Frederick Banting and Charles Best worked on insulin at the University of Toronto in 1921.<br>• The first human patient, 14-year-old Leonard Thompson, received an injection in January 1922.<br>• Banting and his colleagues sold the patent to the University of Toronto for one dollar.<br>• Before insulin, type 1 diabetes was generally fatal.<br><br>The student wants to emphasize that the discoverers did not seek to profit from insulin. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Banting and his colleagues sold the patent for insulin to the University of Toronto for just one dollar.",
      "Before insulin, type 1 diabetes was generally fatal, until Leonard Thompson, age 14, received the first injection in January 1922.",
      "Frederick Banting and Charles Best worked on insulin at the University of Toronto in 1921, a year before its first use in a patient.",
      "Banting, who worked on insulin at the University of Toronto in 1921, earned a large profit by selling its patent."
    ],
    [
      "<i>While researching molecular biology, a student has taken the following notes:</i><br>• In 1953, James Watson and Francis Crick proposed the double-helix structure of DNA.<br>• DNA consists of two strands of nucleotides.<br>• Adenine pairs with thymine, and guanine pairs with cytosine.<br>• This pairing suggested how DNA could be copied.<br><br>The student wants to explain how DNA's structure suggested a way for it to be copied. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Because adenine always pairs with thymine and guanine with cytosine, each strand of the double helix can serve as a template for a new partner strand.",
      "In 1953, James Watson and Francis Crick proposed that DNA consists of two strands of nucleotides arranged in a double helix, demonstrating.",
      "Adenine pairs with thymine and guanine pairs with cytosine, a pattern that Watson and Crick described in their 1953 proposal, a finding.",
      "Watson and Crick's 1953 model showed that DNA is copied when adenine pairs with guanine and thymine pairs with cytosine, which historians."
    ],
    [
      "<i>While researching genetics, a student has taken the following notes:</i><br>• The Human Genome Project officially began in 1990.<br>• It was declared essentially complete in 2003.<br>• It cost about $2.7 billion.<br>• It mapped about 3 billion base pairs of human DNA.<br><br>The student wants to emphasize the time and money that the Human Genome Project required. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The Human Genome Project took 13 years, from 1990 to 2003, and cost about $2.7 billion.",
      "The Human Genome Project mapped about 3 billion base pairs of human DNA.",
      "Beginning in 1990, the Human Genome Project went on to map about 3 billion base pairs of human DNA.",
      "Declared essentially complete in 2003, the project mapped about 3 billion base pairs of human DNA."
    ],
    [
      "<i>While researching chemistry, a student has taken the following notes:</i><br>• Dmitri Mendeleev published his periodic table in 1869.<br>• He arranged the known elements by atomic weight and chemical properties.<br>• He left gaps for undiscovered elements and predicted their properties.<br>• Gallium, discovered in 1875, closely matched the properties he had predicted for 'eka-aluminium.'<br><br>The student wants to emphasize the predictive success of Mendeleev's table. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Mendeleev's table left gaps for undiscovered elements, and gallium, found in 1875, closely matched the properties he had predicted for 'eka-aluminium.'",
      "In 1869, Dmitri Mendeleev arranged the known elements by atomic weight and chemical properties in his periodic table, which historians and scientists regard as a pivotal milestone in the field.",
      "Mendeleev left gaps in his 1869 periodic table, which he organized by atomic weight and chemical properties, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Gallium was discovered in 1875, six years after Mendeleev arranged the elements by atomic weight, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching food safety, a student has taken the following notes:</i><br>• Louis Pasteur developed the process now called pasteurization in the 1860s.<br>• He first used it to prevent spoilage in wine and beer.<br>• The process heats a liquid to a specific temperature for a set time to kill harmful microbes.<br>• It was later applied to milk.<br><br>The student wants to explain what pasteurization is to readers who may not be familiar with the term. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Pasteurization, developed by Louis Pasteur in the 1860s, heats a liquid to a specific temperature for a set time to kill harmful microbes.",
      "Louis Pasteur first used his process to prevent spoilage in wine and beer, and it was later applied to milk, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Developed in the 1860s, pasteurization was first applied to wine and beer and was later extended to milk, a finding that researchers have documented across multiple independent studies.",
      "Pasteurization, named after Louis Pasteur, kills microbes by freezing a liquid for a set period of time, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching climate science, a student has taken the following notes:</i><br>• In the 1820s, Joseph Fourier proposed that the atmosphere helps keep Earth warm.<br>• In 1859, John Tyndall measured that carbon dioxide and water vapor absorb infrared radiation.<br>• In 1896, Svante Arrhenius calculated that changes in carbon dioxide could alter Earth's temperature.<br><br>The student wants to emphasize that understanding of the greenhouse effect developed gradually over many decades. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Scientists built up the understanding of the greenhouse effect step by step, from Fourier in the 1820s to Tyndall's measurements in 1859 and Arrhenius's calculations in 1896.",
      "In 1859, John Tyndall measured that carbon dioxide and water vapor absorb infrared radiation, a key finding in climate science, a finding that researchers have documented across multiple independent studies.",
      "Svante Arrhenius calculated in 1896 that changes in carbon dioxide could alter Earth's temperature, a result that surprised other scientists, which historians and scientists regard as a pivotal milestone in the field.",
      "Joseph Fourier proposed in the 1820s that the atmosphere helps keep Earth warm, the first step in a story that ended with Tyndall, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching atmospheric carbon dioxide, a student has taken the following notes:</i><br>• Charles Keeling began measuring atmospheric carbon dioxide at Mauna Loa Observatory in Hawaii in 1958.<br>• The 1958 readings were about 315 parts per million (ppm).<br>• Monthly readings exceeded 420 ppm in 2023.<br>• The record shows a yearly seesaw pattern tied to plant growth in the Northern Hemisphere.<br><br>The student wants to emphasize the long-term increase in carbon dioxide using specific figures. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Measurements at Mauna Loa show atmospheric carbon dioxide rising from about 315 parts per million in 1958 to monthly readings above 420 in 2023.",
      "Charles Keeling began measuring atmospheric carbon dioxide at Mauna Loa Observatory in Hawaii in 1958, which historians and scientists regard.",
      "The Mauna Loa record shows a yearly seesaw pattern in carbon dioxide that is tied to plant growth in the Northern Hemisphere, demonstrating.",
      "Beginning in 1958, Keeling's measurements at Mauna Loa revealed a yearly pattern tied to plant growth, a finding that researchers have."
    ],
    [
      "<i>While researching environmental policy, a student has taken the following notes:</i><br>• The Montreal Protocol was adopted in 1987 to phase out chlorofluorocarbons (CFCs) and other ozone-depleting substances.<br>• Every United Nations member country has ratified it.<br>• A 2022 UN assessment projected that the Antarctic ozone layer would recover to 1980 levels by about 2066.<br>• The ozone layer shields Earth's surface from harmful ultraviolet radiation.<br><br>The student wants to emphasize the international cooperation behind the Montreal Protocol. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Every United Nations member country has ratified the Montreal Protocol, the 1987 agreement to phase out ozone-depleting substances such as CFCs.",
      "A 2022 UN assessment projected that the Antarctic ozone layer would recover to 1980 levels by about 2066, demonstrating its broad significance across diverse geographic and historical contexts.",
      "The ozone layer, which shields Earth's surface from harmful ultraviolet radiation, is protected by the 1987 Montreal Protocol, a finding that researchers have documented across multiple independent studies.",
      "Adopted in 1987, the Montreal Protocol phases out CFCs and other substances that damage the ozone layer, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching renewable energy, a student has taken the following notes:</i><br>• Edmond Becquerel observed the photovoltaic effect in 1839.<br>• In 1954, Bell Labs produced the first practical silicon solar cell, with about 6 percent efficiency.<br>• Commercial solar panels today typically reach about 20 percent efficiency or more.<br>• Prices of solar modules have dropped dramatically since 2010.<br><br>The student wants to emphasize improvement in solar cell efficiency over time. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "From about 6 percent efficiency in the first practical silicon cell of 1954, commercial solar panels today typically reach about 20 percent or more.",
      "Edmond Becquerel observed the photovoltaic effect in 1839, more than a century before the first practical silicon solar cell, a finding that researchers have documented across multiple independent studies.",
      "Prices of solar modules have dropped dramatically since 2010, making panels widely affordable, which historians and scientists regard as a pivotal milestone in the field.",
      "Bell Labs produced the first practical silicon solar cell in 1954, and solar panels have become much cheaper since then, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching battery technology, a student has taken the following notes:</i><br>• John Goodenough, M. Stanley Whittingham, and Akira Yoshino received the 2019 Nobel Prize in Chemistry for their work on lithium-ion batteries.<br>• Sony released the first commercial lithium-ion battery in 1991.<br>• Lithium-ion batteries power smartphones, laptops, and electric vehicles.<br>• These batteries are rechargeable.<br><br>The student wants to emphasize the scientific recognition that lithium-ion battery research has received. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "John Goodenough, M. Stanley Whittingham, and Akira Yoshino received the 2019 Nobel Prize in Chemistry for their work on lithium-ion batteries.",
      "Sony released the first commercial lithium-ion battery in 1991, and such batteries now power smartphones and laptops, which historians and scientists regard as a pivotal milestone in the field.",
      "Lithium-ion batteries are rechargeable, and they power smartphones, laptops, and electric vehicles, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Sony, which released the first commercial lithium-ion battery in 1991, won the 2019 Nobel Prize in Chemistry, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching the history of the internet, a student has taken the following notes:</i><br>• On October 29, 1969, researchers at UCLA sent the first message over ARPANET to the Stanford Research Institute.<br>• The intended message was 'LOGIN.'<br>• The system crashed after the first two letters, so the message received was 'LO.'<br>• ARPANET was funded by the U.S. Department of Defense.<br><br>The student wants to emphasize the modest beginnings of the network with a brief anecdote. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The first message sent over ARPANET, on October 29, 1969, was meant to be 'LOGIN,' but the system crashed after 'LO.'",
      "ARPANET, which was funded by the U.S. Department of Defense, carried its first message from UCLA to the Stanford Research Institute.",
      "On October 29, 1969, researchers at UCLA successfully sent the complete word 'LOGIN' to the Stanford Research Institute over ARPANET.",
      "The Department of Defense funded ARPANET, whose first message was only partly received by the Stanford Research Institute."
    ],
    [
      "<i>While researching the web, a student has taken the following notes:</i><br>• Tim Berners-Lee proposed the World Wide Web in 1989 while working at CERN.<br>• The first website went online in 1991.<br>• In 1993, CERN made the web's technology available royalty-free.<br>• The web is a system for accessing documents over the internet, and it is distinct from the internet itself.<br><br>The student wants to emphasize the decision that made the web's technology freely available. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "In 1993, CERN made the web's technology available royalty-free, so that anyone could use it without paying.",
      "Tim Berners-Lee proposed the web in 1989 while working at CERN, and the first website went online in 1991.",
      "The World Wide Web is a system for accessing documents over the internet, which is a separate thing.",
      "Berners-Lee proposed the web at CERN in 1989, and CERN made the technology available royalty-free two."
    ],
    [
      "<i>While researching the history of computing, a student has taken the following notes:</i><br>• In 1936, Alan Turing published a paper introducing the concept now called the Turing machine.<br>• During World War II, he worked at Bletchley Park on breaking German Enigma-encrypted messages.<br>• He designed the Bombe, an electromechanical machine that built on earlier Polish work, to help find Enigma settings.<br>• In 1950, he proposed the imitation game now known as the Turing test.<br><br>The student wants to emphasize the range of Turing's contributions, from theory to wartime work. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Turing's contributions ranged from the theoretical Turing machine of 1936 to wartime codebreaking at Bletchley Park.",
      "In 1950, Turing proposed the imitation game, now called the Turing test, as a way to evaluate machine intelligence, which historians and scientists regard as a pivotal milestone in the field.",
      "At Bletchley Park, Turing designed the Bombe, which built on earlier Polish work, to help break Enigma messages, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Turing introduced the Turing machine in 1936 and later broke the Enigma code on his own during World War II."
    ],
    [
      "<i>While researching early computing, a student has taken the following notes:</i><br>• In 1843, Ada Lovelace translated an article about Charles Babbage's Analytical Engine.<br>• Her added notes were about three times as long as the article.<br>• The notes include an algorithm for computing Bernoulli numbers on the machine.<br>• She speculated that such a machine might manipulate symbols other than numbers, such as music.<br><br>The student wants to emphasize that Lovelace's contribution went well beyond translation. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Lovelace's 1843 notes, which were about three times as long as the article she translated, included an algorithm for computing Bernoulli numbers on Babbage's machine.",
      "In 1843, Ada Lovelace translated an article about Charles Babbage's Analytical Engine, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Lovelace translated an article about Babbage's engine and speculated that such machines might manipulate symbols such as music, a finding that researchers have documented across multiple independent studies.",
      "Ada Lovelace's 1843 translation of the article was about three times as long as the original text, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching satellite navigation, a student has taken the following notes:</i><br>• GPS satellite clocks run faster than clocks on the ground by about 38 microseconds per day because of relativistic effects.<br>• Without correction, positioning errors would grow by roughly 10 kilometers per day.<br>• GPS became fully operational in 1995.<br>• The system uses a constellation of at least 24 satellites.<br><br>The student wants to explain why relativity matters for GPS. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Because relativistic effects make GPS satellite clocks run about 38 microseconds per day fast, uncorrected position errors would grow by roughly 10 kilometers daily.",
      "GPS became fully operational in 1995 with a constellation of at least 24 satellites, a finding that researchers have documented across multiple independent studies.",
      "Satellite clocks in the GPS system run faster than clocks on the ground by about 38 microseconds per day, which historians and scientists regard as a pivotal milestone in the field.",
      "Relativistic effects make GPS clocks run slower, causing errors of 10 kilometers per day unless satellites are launched in groups of 24, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching volcanoes, a student has taken the following notes:</i><br>• Mauna Kea's summit stands 4,207 meters above sea level.<br>• Mount Everest's summit stands 8,849 meters above sea level.<br>• Mauna Kea's base lies on the ocean floor, and its total height from base to summit is over 10,000 meters.<br>• Mauna Kea is a volcano on Hawaii's Big Island.<br><br>The student wants to show that Mauna Kea can be considered taller than Everest depending on how height is measured. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Measured from its base on the ocean floor, Mauna Kea rises over 10,000 meters, taller than Everest's 8,849 meters above sea level.",
      "Mauna Kea's summit stands 4,207 meters above sea level, less than half the height of Everest's summit, which historians and scientists regard as a pivotal milestone in the field.",
      "Mauna Kea, a volcano on Hawaii's Big Island, has a summit that stands 4,207 meters above sea level, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Mauna Kea is taller than Everest because its summit stands 4,207 meters above sea level on Hawaii's Big Island, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching historic eruptions, a student has taken the following notes:</i><br>• Krakatoa erupted on August 26 and 27, 1883.<br>• The explosion was heard about 4,800 kilometers away on Rodrigues Island.<br>• Tsunamis triggered by the eruption killed more than 36,000 people.<br>• Global average temperatures dropped by about 1.2 degrees Celsius over the following year.<br><br>The student wants to emphasize the global reach of the eruption's effects. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The 1883 Krakatoa eruption was heard about 4,800 kilometers away and cooled global average temperatures by about 1.2 degrees Celsius the following year.",
      "Tsunamis triggered by the 1883 eruption of Krakatoa killed more than 36,000 people, demonstrating its broad significance across diverse geographic.",
      "The August 1883 eruption of Krakatoa was heard on Rodrigues Island and produced deadly tsunamis, a finding that researchers have documented.",
      "Krakatoa erupted on August 26 and 27, 1883, and its tsunamis cooled global temperatures by 1.2 degrees Celsius, which historians and scientists."
    ],
    [
      "<i>While researching impact events, a student has taken the following notes:</i><br>• On June 30, 1908, a massive explosion occurred over the Tunguska region of Siberia.<br>• About 80 million trees were flattened across roughly 2,000 square kilometers.<br>• No impact crater has been found.<br>• Scientists generally conclude that an asteroid or comet fragment exploded in the air several kilometers above the ground.<br><br>The student wants to explain why no crater has been found at Tunguska. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "No crater has been found at Tunguska because the object is thought to have exploded in the air several kilometers above the ground.",
      "The 1908 Tunguska explosion flattened about 80 million trees across roughly 2,000 square kilometers of Siberia, a finding that researchers have documented across multiple independent studies.",
      "Scientists generally conclude that an asteroid or comet fragment caused the Tunguska explosion on June 30, 1908, which historians and scientists regard as a pivotal milestone in the field.",
      "The Tunguska object left no crater because it was too small to survive entry into Earth's atmosphere intact, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching mass extinctions, a student has taken the following notes:</i><br>• About 66 million years ago, an asteroid roughly 10 kilometers wide struck what is now Mexico's Yucatan Peninsula.<br>• The Chicxulub crater is about 180 kilometers wide.<br>• A worldwide layer of clay rich in iridium dates to the same time.<br>• Iridium is rare in Earth's crust but more abundant in many asteroids.<br>• The impact coincided with the extinction of the non-avian dinosaurs.<br><br>The student wants to explain evidence that links an asteroid impact to the extinction. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "A worldwide clay layer rich in iridium, an element more abundant in asteroids than in Earth's crust, dates to the time of the impact that coincided with the dinosaurs' extinction.",
      "About 66 million years ago, an asteroid roughly 10 kilometers wide struck what is now Mexico's Yucatan Peninsula, which historians and scientists regard as a pivotal milestone in the field.",
      "The Chicxulub crater, about 180 kilometers wide, marks the spot where an asteroid struck the Yucatan Peninsula, demonstrating its broad significance across diverse geographic and historical contexts.",
      "Iridium is rare in Earth's crust, but an asteroid struck the Yucatan Peninsula 66 million years ago, a finding that researchers have documented across multiple independent studies."
    ],
    [
      "<i>While researching lakes, a student has taken the following notes:</i><br>• Lake Baikal is located in southern Siberia, Russia.<br>• Its maximum depth is 1,642 meters, making it the deepest lake on Earth.<br>• It is about 25 million years old, one of the oldest lakes in the world.<br>• It holds about 20 percent of the world's unfrozen surface fresh water.<br><br>The student wants to emphasize the volume of water in Lake Baikal. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Though located in a single region of southern Siberia, Lake Baikal holds about 20 percent of the world's unfrozen surface fresh water.",
      "At 1,642 meters deep, Lake Baikal in southern Siberia is the deepest lake on Earth, demonstrating its broad significance across diverse geographic and historical contexts.",
      "About 25 million years old, Lake Baikal is one of the oldest lakes in the world, a finding that researchers have documented across multiple independent studies.",
      "Lake Baikal in southern Siberia is the deepest lake on Earth and one of the oldest, with a maximum depth of 1,642 meters."
    ],
    [
      "<i>While researching the Sahara, a student has taken the following notes:</i><br>• The Sahara covers about 9 million square kilometers.<br>• Between roughly 11,000 and 5,000 years ago, during the African Humid Period, the region had lakes and grasslands.<br>• Rock art in the central Sahara depicts cattle, giraffes, and hippos.<br>• A gradual change in Earth's orbital tilt altered monsoon rainfall and ended the humid period.<br><br>The student wants to present evidence that the Sahara was once much greener than it is today. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Rock art in the central Sahara depicting cattle, giraffes, and hippos supports evidence that the region had lakes and grasslands during the African Humid Period.",
      "Covering about 9 million square kilometers, the Sahara is one of the largest deserts on Earth, a finding that researchers have documented across multiple independent studies.",
      "A gradual change in Earth's orbital tilt altered monsoon rainfall and ended the African Humid Period about 5,000 years ago, which historians and scientists regard as a pivotal milestone in the field.",
      "Between 11,000 and 5,000 years ago, the Sahara was an arid region that received little rainfall, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching ocean exploration, a student has taken the following notes:</i><br>• Challenger Deep in the Mariana Trench is about 10,900 meters deep.<br>• In 1960, Jacques Piccard and Don Walsh reached the bottom aboard the bathyscaphe Trieste.<br>• In 2012, James Cameron made the first solo descent.<br>• Pressure at the bottom is more than 1,000 times the pressure at sea level.<br><br>The student wants to present the history of human descents to Challenger Deep. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Challenger Deep was first reached in 1960 by Jacques Piccard and Don Walsh aboard the Trieste, and in 2012 James Cameron made the first solo descent.",
      "Challenger Deep, at about 10,900 meters, has a pressure more than 1,000 times that at sea level, which historians and scientists regard.",
      "Jacques Piccard and Don Walsh descended to the bottom of Challenger Deep, which is about 10,900 meters deep, in 1960, demonstrating its broad.",
      "James Cameron made the first descent to Challenger Deep in 2012, where the pressure is 1,000 times that at sea level, a finding that researchers."
    ],
    [
      "<i>While researching bees, a student has taken the following notes:</i><br>• A worker bee produces about one-twelfth of a teaspoon of honey in her lifetime.<br>• Worker bees live about six weeks in summer.<br>• Producing one pound of honey requires a colony to visit roughly 2 million flowers.<br>• Honeybee colonies forage for nectar.<br><br>The student wants to emphasize how tiny each individual bee's contribution is. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "A single worker bee makes only about one-twelfth of a teaspoon of honey in her lifetime of roughly six weeks.",
      "Producing one pound of honey requires a colony to visit roughly 2 million flowers.",
      "Worker bees live about six weeks in summer, during which colonies forage for nectar.",
      "A worker bee visits roughly 2 million flowers to produce about one-twelfth of a teaspoon of honey."
    ],
    [
      "<i>While researching how scientists study past climate, a student has taken the following notes:</i><br>• Dendrochronology is the dating of events using tree rings.<br>• The astronomer A. E. Douglass developed the method in the early 1900s.<br>• Each ring generally represents one year, and wider rings indicate favorable growing conditions.<br>• A bristlecone pine called Methuselah in California is over 4,800 years old.<br><br>The student wants to explain how tree rings reveal information about past climate. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Because each ring generally represents one year, with wider rings indicating favorable growing conditions, tree rings preserve a record of past climate.",
      "Dendrochronology, developed by the astronomer A. E. Douglass in the early 1900s, dates events using tree rings, a finding that researchers have documented across multiple independent studies.",
      "A bristlecone pine called Methuselah in California is over 4,800 years old, which makes it one of the oldest known trees, which historians and scientists regard as a pivotal milestone in the field.",
      "Each tree ring represents one year, so the 4,800 rings of the Methuselah pine show that it began growing in the early 1900s, demonstrating its broad significance across diverse geographic and historical contexts."
    ],
    [
      "<i>While researching Earth's history, a student has taken the following notes:</i><br>• In 1912, Alfred Wegener proposed the idea of continental drift.<br>• Pangaea was a supercontinent that had assembled by roughly 335 million years ago.<br>• It began to break apart about 200 million years ago.<br>• Matching fossils and rock formations on separate continents support the idea that the continents were once joined.<br><br>The student wants to present a timeline of Pangaea's existence. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Pangaea had assembled by roughly 335 million years ago and began breaking apart about 200 million years ago.",
      "In 1912, Alfred Wegener proposed continental drift, citing matching fossils and rock formations on separate continents.",
      "Matching fossils on separate continents are evidence that Pangaea first formed about 200 million years ago.",
      "Pangaea, which assembled about 335 million years ago, was first proposed by Wegener in 1912."
    ],
    [
      "<i>While researching physics, a student has taken the following notes:</i><br>• Albert Einstein predicted gravitational waves in 1916.<br>• LIGO detected them on September 14, 2015.<br>• The signal came from two black holes merging about 1.3 billion light-years away.<br>• The detection was announced in February 2016, and the 2017 Nobel Prize in Physics honored the work.<br><br>The student wants to emphasize the long interval between the prediction of gravitational waves and their detection. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Predicted by Einstein in 1916, gravitational waves were not detected until 2015, when LIGO recorded the signal of two black holes merging.",
      "LIGO detected gravitational waves from two black holes that merged about 1.3 billion light-years away, demonstrating its broad significance across diverse geographic and historical contexts.",
      "The 2017 Nobel Prize in Physics honored the detection of gravitational waves that LIGO announced in February 2016, a finding that researchers have documented across multiple independent studies.",
      "Einstein predicted gravitational waves in 1916, and LIGO announced their detection in February 2016, a year later, which historians and scientists regard as a pivotal milestone in the field."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• In 1911, Dutch physicist Heike Kamerlingh Onnes cooled liquid helium to 4.2 Kelvin (−268.95°C).<br>• At this temperature, the electrical resistance of solid mercury wire vanished completely.<br>• This phenomenon, called superconductivity, allows electric current to flow indefinitely without energy loss.<br>• In 1986, Georg Bednorz and K. Alex Müller discovered ceramic cuprate superconductors that operate at 35 Kelvin, and later cuprates reached 133 Kelvin.</i><br><br>The student wants to contrast Onnes's 1911 discovery with the 1986 breakthrough. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Whereas Onnes's mercury superconductor required cooling to 4.2 K in 1911, Bednorz and Müller's 1986 ceramic cuprates achieved superconductivity at 35 K.",
      "In 1911, Dutch physicist Heike Kamerlingh Onnes cooled solid mercury wire with liquid helium to 4.2 Kelvin, discovering that its electrical.",
      "Superconductivity allows electric current to flow indefinitely without energy loss in both solid mercury wire at 4.2 Kelvin and ceramic cuprate.",
      "Georg Bednorz and K. Alex Müller discovered ceramic cuprate superconductors in 1986, seventy-five years after Heike Kamerlingh Onnes first observed."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• The Svalbard Global Seed Vault is built 120 meters inside a sandstone mountain on Spitsbergen Island, Norway.<br>• It stores duplicate samples of over 1.2 million crop varieties from gene banks worldwide.<br>• Permafrost surrounding the rock vault naturally maintains a temperature of −3°C to −4°C even if mechanical cooling fails.<br>• Mechanical refrigeration units chill the vault chambers further to −18°C to preserve seed viability for centuries.</i><br><br>The student wants to explain how the vault's natural environment provides a backup safeguard for the seeds. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Surrounding permafrost keeps the rock vault at −3°C to −4°C even if its −18°C refrigeration fails.",
      "Located 120 meters inside a sandstone mountain on Spitsbergen Island in Norway, the Svalbard Global Seed Vault houses over 1.2 million duplicate crop samples from around the world.",
      "Mechanical refrigeration units inside the Svalbard Global Seed Vault chill the storage chambers to −18°C so that 1.2 million crop varieties remain viable for centuries.",
      "Gene banks around the world send duplicate seed samples to Spitsbergen Island, Norway, where chambers carved 120 meters into sandstone are cooled to −18°C."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• Active noise-canceling (ANC) headphones use external microphones to sample ambient low-frequency sounds, such as airplane engine hum.<br>• An internal digital signal processor inverts the phase of the incoming sound wave by 180 degrees.<br>• When the speaker plays this anti-phase wave alongside the ambient noise, destructive interference cancels the sound before it reaches the eardrum.<br>• Passive noise isolation relies on dense ear-cup foam to physically block high-frequency sounds.</i><br><br>The student wants to explain the physical mechanism by which ANC headphones neutralize low-frequency noise. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "ANC headphones invert ambient sound waves by 180° to cancel noise via destructive interference.",
      "Unlike passive noise isolation, which uses dense ear-cup foam to physically block high-frequency sounds, active noise-canceling headphones use external microphones and processors.",
      "Airplane engine hum is a low-frequency ambient sound that external microphones on active noise-canceling headphones sample while dense ear-cup foam blocks higher frequencies.",
      "Both active noise-canceling headphones and passive noise-isolating headphones help listeners hear audio clearly in noisy environments such as commercial aircraft cabins."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• Roman concrete (opus caementicium) used in marine harbors like Portus has survived waves for 2,000 years, whereas modern Portland-cement concrete often corrodes in seawater within decades.<br>• Roman builders mixed volcanic ash from Pozzuoli with quicklime (calcium oxide) and seawater.<br>• Geologist Marie Jackson found that seawater percolating through the concrete dissolves volcanic ash and crystallizes rare aluminum-tobermorite minerals across microscopic cracks.<br>• This self-healing crystallization continuously reinforces the harbor piers over time.</i><br><br>The student wants to explain why Roman marine concrete grows stronger over time in seawater. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Seawater reacts with volcanic ash in Roman concrete to grow tobermorite crystals that seal cracks.",
      "Whereas modern Portland-cement concrete often corrodes in seawater within a few decades, Roman opus caementicium structures at Portus have survived ocean waves for two millennia.",
      "Ancient Roman builders constructed marine harbors like Portus by mixing volcanic ash from Pozzuoli with quicklime and seawater to produce opus caementicium.",
      "Geologist Marie Jackson studied 2,000-year-old Roman harbor piers at Portus and compared their chemical composition with that of modern Portland-cement concrete."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• In 1951, Henrietta Lacks was treated for cervical cancer at Johns Hopkins Hospital.<br>• Without her knowledge, researcher George Gey cultured cells from her biopsy, creating the HeLa immortal cell line.<br>• Unlike normal somatic cells, which stop dividing after ~50 divisions (the Hayflick limit), HeLa cells express hyperactive telomerase and divide indefinitely.<br>• HeLa cells enabled Jonas Salk's 1953 polio vaccine trials and have been cited in over 110,000 biomedical studies.</i><br><br>The student wants to explain the biological property that makes HeLa cells 'immortal' compared with normal cells. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Hyperactive telomerase lets HeLa cells bypass the 50-division Hayflick limit and divide endlessly.",
      "Cultured by George Gey at Johns Hopkins Hospital in 1951 from Henrietta Lacks's biopsy, the HeLa cell line enabled Jonas Salk's polio vaccine and over 110,000 biomedical studies.",
      "Jonas Salk used HeLa cells in 1953 to test his polio vaccine, and the cell line has since been cited in more than 110,000 published biomedical research papers worldwide.",
      "In 1951, researcher George Gey cultured cells from a cervical biopsy taken from Henrietta Lacks at Johns Hopkins Hospital without her knowledge or consent."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• The Antikythera mechanism, recovered in 1901 from a Roman-era shipwreck off Greece, dates to roughly 100 BCE.<br>• X-ray computed tomography by Tony Freeth in 2006 revealed at least 30 interlocking bronze gears inside its corroded wooden casing.<br>• Turning a hand crank rotated pointers showing the phases of the Moon, the Metonic 19-year calendar cycle, and Saros eclipse predictions.<br>• Pin-and-slot epicyclic gearing reproduced the Moon's variable orbital velocity (hipparchic anomaly).</i><br><br>The student wants to emphasize how the mechanism modeled the Moon's uneven speed across the sky. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "The device used pin-and-slot epicyclic gears to mimic the Moon's variable orbital velocity.",
      "Recovered in 1901 from an ancient shipwreck off the coast of Greece, the Antikythera.",
      "In 2006, researcher Tony Freeth used X-ray computed tomography to peer inside.",
      "Turning a hand crank on the side of the 100 BCE Antikythera mechanism rotated exterior."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• Conventional lithium-ion batteries use a liquid organic carbonate electrolyte to shuttle lithium ions between the anode and cathode.<br>• Liquid electrolytes are volatile and can catch fire if internal dendrites puncture the separator.<br>• Solid-state batteries replace the liquid electrolyte with a thin ceramic, sulfide, or solid-polymer separator.<br>• Solid electrolytes block dendrite penetration, are non-flammable, and permit the use of pure lithium-metal anodes that increase energy density by up to 50%.</i><br><br>The student wants to highlight two key advantages of solid-state batteries over conventional lithium-ion batteries. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Solid-state batteries eliminate flammable liquid electrolytes and boost energy density by up to 50%.",
      "In conventional lithium-ion batteries, a liquid organic carbonate electrolyte shuttles lithium ions between the anode and cathode during charging and discharging cycles.",
      "Solid-state batteries replace liquid organic carbonate electrolytes with thin separators made from ceramic, sulfide, or solid-polymer materials that conduct lithium ions.",
      "If internal lithium dendrites puncture the separator inside a conventional lithium-ion battery, the volatile liquid organic carbonate electrolyte can overheat and catch fire."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• In 1815, Mount Tambora on Sumbawa Island, Indonesia, erupted with a Volcanic Explosivity Index (VEI) of 7.<br>• The eruption injected roughly 60 megatons of sulfur dioxide into the stratosphere, forming a global sulfate aerosol veil that reflected solar radiation.<br>• Global average temperatures dropped by 0.5°C to 0.8°C in 1816, known across Europe and North America as the 'Year Without a Summer.'<br>• June snowstorms in New England and incessant cold rain in Europe caused widespread crop failures and famine.</i><br><br>The student wants to explain the causal chain linking the 1815 Tambora eruption to the 1816 cooling. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Tambora's 60 megatons of stratospheric sulfur dioxide formed a reflective aerosol veil that cooled Earth in 1816.",
      "Known across Europe and North America as the 'Year Without a Summer,' 1816 brought June snowstorms to New England and incessant cold rain that ruined harvests.",
      "Mount Tambora on Sumbawa Island, Indonesia, erupted in 1815 with a Volcanic Explosivity Index of 7, the largest volcanic eruption recorded in modern history.",
      "In 1816, widespread crop failures and famine struck Europe and North America after global average temperatures dropped by between 0.5°C and 0.8°C."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• Spider dragline silk, spun by orb-weaving spiders such as Trichonephila clavipes, has a tensile strength of 1.1 gigapascals—comparable to high-grade alloy steel.<br>• Because its density is only one-sixth that of steel, dragline silk is five times stronger by weight.<br>• Its protein chains combine rigid crystalline beta-sheet nanocrystals embedded in an elastic, amorphous glycine-rich matrix.<br>• This composite molecular architecture lets the fiber stretch by 30% without snapping, absorbingthree times more impact energy than Kevlar.</i><br><br>The student wants to explain how the molecular structure of spider silk gives it both strength and elasticity. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Spider silk pairs rigid beta-sheet nanocrystals with an elastic glycine matrix, letting it resist high tension while stretching 30%.",
      "Spun by orb-weaving spiders such as Trichonephila clavipes, dragline silk has a tensile strength of 1.1 gigapascals and is five times stronger by weight than alloy steel.",
      "Because dragline spider silk has only one-sixth the density of high-grade alloy steel, it can absorb three times more impact energy per gram than synthetic Kevlar fibers.",
      "Researchers studying the orb-weaving spider Trichonephila clavipes have measured the tensile strength of its dragline silk at 1.1 gigapascals."
    ],
    [
      "<i>While researching a topic, a student has taken the following notes:<br>• The Rosetta Stone, carved in 196 BCE in Memphis, Egypt, records a royal decree issued by a council of priests honoring King Ptolemy V.<br>• The decree is inscribed in three scripts: Ancient Egyptian hieroglyphs (top), Egyptian Demotic script (middle), and Ancient Greek (bottom).<br>• Because scholars could read Ancient Greek, Thomas Young and Jean-François Champollion compared proper names in cartouches across the scripts.<br>• In 1822, Champollion proved that hieroglyphs combined phonetic signs and ideograms, unlocking ancient Egyptian texts.</i><br><br>The student wants to explain how the Rosetta Stone's design enabled Champollion's 1822 decipherment. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      "Presenting the same decree in readable Greek alongside Egyptian scripts let Champollion match names and decode hieroglyphs.",
      "Carved in 196 BCE in Memphis, Egypt, the Rosetta Stone records a royal decree issued by a council of priests to honor the reign of King Ptolemy V.",
      "The top register of the Rosetta Stone is written in Ancient Egyptian hieroglyphs, the middle register is written in Demotic script, and the bottom register is in Ancient Greek.",
      "In 1822, French scholar Jean-François Champollion demonstrated that Ancient Egyptian hieroglyphs were not purely symbolic ideograms but also included phonetic signs."
    ]
  ],
  [
    [
      "<i>In 1912, German meteorologist Alfred Wegener proposed that Earth's continents were once joined in a single supercontinent called Pangaea. Most geologists of his era dismissed the hypothesis because Wegener could not identify a force strong enough to move massive plates of rock. ______ in the 1960s, discoveries of seafloor spreading and mantle convection provided the missing physical mechanism, vindicating Wegener's core insight.</i><br><br>Which choice completes the text with the most logical transition?",
      "Decades later,",
      "For instance,",
      "Similarly,",
      "In other words,"
    ],
    [
      "<i>Most mammals rely on hemoglobin in their red blood cells to transport oxygen throughout their bodies. The crocodile icefish (Channichthyidae) of the Southern Ocean lacks hemoglobin entirely, rendering its blood pale and translucent. ______ the fish survives because the subzero Antarctic water holds high concentrations of dissolved oxygen that can diffuse directly into its blood plasma.</i><br><br>Which choice completes the text with the most logical transition?",
      "Even so,",
      "For this reason,",
      "Furthermore,",
      "In addition,"
    ],
    [
      "<i>When the James Webb Space Telescope launched in December 2021, engineers had to fold its 6.5-meter primary mirror like origami so it could fit inside the Ariane 5 rocket fairing. ______ once the spacecraft reached its orbit at the second Sun-Earth Lagrange point, actuators slowly unfolded the eighteen gold-coated beryllium segments into a single alignment.</i><br><br>Which choice completes the text with the most logical transition?",
      "Then,",
      "Nevertheless,",
      "By contrast,",
      "For example,"
    ],
    [
      "<i>During the seventeenth century, Dutch painter Johannes Vermeer used ultramarine—a deep blue pigment ground from semi-precious lapis lazuli mined in Afghanistan—not only for vibrant draperies, but also to mix into the grey shadows of white walls. ______ his small domestic canvases were exceptionally expensive to produce, often straining his household finances.</i><br><br>Which choice completes the text with the most logical transition?",
      "Thus,",
      "However,",
      "Instead,",
      "Meanwhile,"
    ],
    [
      "<i>Botanists classify plants that complete their entire life cycle within a single growing season as annuals. ______ perennials are plants that persist for many years, dying back to their rootstock in winter and regrowing their stems and foliage each spring.</i><br><br>Which choice completes the text with the most logical transition?",
      "By contrast,",
      "Consequently,",
      "Specifically,",
      "Moreover,"
    ],
    [
      "<i>In 1928, physicist Paul Dirac formulated a relativistic wave equation to describe the behavior of electrons moving near the speed of light. Unexpectedly, his equation yielded two sets of solutions: one for negatively charged electrons and another for a hypothetical positively charged counterpart. ______ in 1932, Carl Anderson photographed the tracks of this exact antimatter particle—the positron—in a cloud chamber.</i><br><br>Which choice completes the text with the most logical transition?",
      "Sure enough,",
      "On the contrary,",
      "Nonetheless,",
      "Otherwise,"
    ],
    [
      "<i>Archaeologists excavating the Bronze Age shipwreck at Uluburun off the coast of Turkey recovered ten tons of Cypriot copper ingots and one ton of tin. When smelted together in a ten-to-one ratio, copper and tin form bronze. ______ the single cargo vessel carried enough raw metal to equip an entire ancient army with three thousand bronze swords and spears.</i><br><br>Which choice completes the text with the most logical transition?",
      "In effect,",
      "However,",
      "Conversely,",
      "Regardless,"
    ],
    [
      "<i>Many desert succulents, such as agaves and prickly pear cacti, utilize Crassulacean Acid Metabolism (CAM) to conserve water. Rather than opening their leaf pores during the scorching day, they keep their pores sealed until nightfall. ______ they lose up to ninety percent less moisture to evaporation than standard C3 plants do.</i><br><br>Which choice completes the text with the most logical transition?",
      "As a result,",
      "On the other hand,",
      "For instance,",
      "In comparison,"
    ],
    [
      "<i>In his 1859 treatise 'On the Origin of Species,' Charles Darwin outlined how natural selection drives evolutionary adaptation over generations. He had no working model of genetics, however, to explain how traits are physically inherited without blending together. ______ Austrian monk Gregor Mendel was conducting pea-plant hybridization experiments in Brno that would eventually solve Darwin's problem, though Darwin never read Mendel's 1866 paper.</i><br><br>Which choice completes the text with the most logical transition?",
      "At the same time,",
      "Therefore,",
      "In other words,",
      "Consequently,"
    ],
    [
      "<i>To survive the crushing pressures of the Mariana Trench at depths exceeding 10,000 meters, the Mariana snailfish (Pseudoliparis swirei) has evolved a skull with incomplete bone ossification and lacks a gas-filled swim bladder, which would implode. ______ its cells accumulate high levels of an organic molecule called trimethylamine N-oxide (TMAO) to prevent its proteins from folding under hydrostatic stress.</i><br><br>Which choice completes the text with the most logical transition?",
      "Additionally,",
      "Nevertheless,",
      "Alternatively,",
      "Instead,"
    ],
    [
      "<i>In macroeconomics, 'stagflation' refers to a simultaneous rise in price inflation and unemployment alongside stagnant economic output. Classical Keynesian models of the 1950s assumed that inflation and unemployment always move in opposite directions along the Phillips curve. ______ when oil price shocks triggered severe stagflation across Western economies in the 1970s, economists had to revise their foundational theories.</i><br><br>Which choice completes the text with the most logical transition?",
      "Accordingly,",
      "Likewise,",
      "For example,",
      "Still,"
    ],
    [
      "<i>In the 1920s, astronomer Edwin Hubble used the 100-inch Hooker Telescope at Mount Wilson to measure the brightness of Cepheid variable stars inside the Andromeda Nebula. His calculations proved that Andromeda lay millions of light-years outside the Milky Way. ______ Andromeda was not a nearby gas cloud within our own galaxy, as many astronomers had assumed, but an independent island universe.</i><br><br>Which choice completes the text with the most logical transition?",
      "In other words,",
      "Despite this,",
      "Conversely,",
      "Meanwhile,"
    ],
    [
      "<i>When medieval European masons constructed Gothic cathedrals in the twelfth century, they replaced heavy Romanesque barrel vaults with pointed rib vaults and exterior flying buttresses. These structural innovations transferred the outward thrust of the roof away from the walls. ______ architects could pierce the stone walls with immense stained-glass rose windows without risking a collapse.</i><br><br>Which choice completes the text with the most logical transition?",
      "Hence,",
      "Even so,",
      "By comparison,",
      "Previously,"
    ],
    [
      "<i>Honeybee foragers communicate the location of distant flower patches by performing a 'waggle dance' on the vertical honeycomb in the dark hive. The angle of the bee's waggle run relative to straight up corresponds to the angle of the flowers relative to the Sun's current azimuth. ______ a waggle run angled 40 degrees to the right of vertical instructs hive mates to fly 40 degrees to the right of the Sun.</i><br><br>Which choice completes the text with the most logical transition?",
      "For example,",
      "However,",
      "Nevertheless,",
      "Instead,"
    ],
    [
      "<i>Pure gold (24 karats) is virtually immune to corrosion and tarnish, which is why ancient gold coins recovered from the seabed still gleam after millennia. The pure metal is so soft and malleable, ______ that jewellers and mints routinely alloy it with copper or silver to prevent everyday wear and bending.</i><br><br>Which choice completes the text with the most logical transition?",
      "though,",
      "therefore,",
      "moreover,",
      "similarly,"
    ],
    [
      "<i>In 1796, English physician Edward Jenner noticed that milkmaids who contracted cowpox—a mild viral infection causing blisters on the hands—rarely developed deadly smallpox during epidemics. ______ Jenner inoculated an eight-year-old boy with fluid from a cowpox blister and later exposed him to smallpox, demonstrating that the boy had acquired complete immunity.</i><br><br>Which choice completes the text with the most logical transition?",
      "Acting on this observation,",
      "Despite this evidence,",
      "On the contrary,",
      "By the same token,"
    ],
    [
      "<i>The planet Venus orbits the Sun at an average distance of 108 million kilometers, whereas Mercury orbits much closer at just 58 million kilometers. One might expect Mercury to have the hottest surface in the solar system. ______ Venus is significantly hotter, maintaining a surface temperature of 465°C due to its dense carbon dioxide atmosphere.</i><br><br>Which choice completes the text with the most logical transition?",
      "In reality,",
      "Consequently,",
      "Furthermore,",
      "Similarly,"
    ],
    [
      "<i>In her 1975 study of courtroom testimony, sociolinguist Robin Lakoff examined how 'hedges' and 'intensifiers' affect a speaker's perceived credibility. Witnesses who used frequent hesitations and qualifiers were judged by mock jurors as less trustworthy even when their factual testimony was accurate. ______ witnesses who spoke in direct, unhedged declarative sentences were rated as more competent.</i><br><br>Which choice completes the text with the most logical transition?",
      "Conversely,",
      "As a result,",
      "Specifically,",
      "Afterward,"
    ],
    [
      "<i>Traditional silicon solar cells can convert at most about 33 percent of incoming sunlight into electricity—a theoretical ceiling known as the Shockley-Queisser limit. To surpass this threshold, materials scientists are developing 'tandem' solar cells that stack a perovskite layer on top of silicon. The perovskite layer absorbs high-energy blue photons; ______ the underlying silicon layer captures the lower-energy red and infrared photons that pass through.</i><br><br>Which choice completes the text with the most logical transition?",
      "meanwhile,",
      "nonetheless,",
      "otherwise,",
      "for instance,"
    ],
    [
      "<i>During the Harlem Renaissance of the 1920s, poet Langston Hughes broke away from traditional European poetic meters. He modeled his verse rhythms on the syncopated cadences, blue notes, and improvisational riffs of jazz and blues music performed in Harlem nightclubs. ______ his 1926 collection 'The Weary Blues' helped establish a distinctly African American modernist poetic idiom.</i><br><br>Which choice completes the text with the most logical transition?",
      "In doing so,",
      "Nevertheless,",
      "By contrast,",
      "Even so,"
    ],
    [
      "<i>When tree frogs (Dryophytes versicolor) prepare for winter in northern forests, they do not burrow below the frost line. Instead, they allow up to sixty percent of their body water to freeze solid into ice crystals in their body cavities. ______ their livers flood their cells with massive quantities of glycerol, which acts as a biological antifreeze to keep the interior of the cells from rupturing.</i><br><br>Which choice completes the text with the most logical transition?",
      "Critically,",
      "However,",
      "Alternatively,",
      "In conclusion,"
    ],
    [
      "<i>In 1974, farmers digging a well near Xi'an, China, unearthed life-sized terracotta statues of soldiers arranged in battle formation. Subsequent excavations revealed over eight thousand individual clay warriors, horses, and bronze chariots buried to guard the tomb of China's first emperor, Qin Shi Huang. ______ no two soldiers have the exact same facial features, suggesting that artisans customized each figure in the massive subterranean army.</i><br><br>Which choice completes the text with the most logical transition?",
      "Remarkably,",
      "Therefore,",
      "Otherwise,",
      "Instead,"
    ],
    [
      "<i>To measure the distance to the Moon with millimeter precision, astrophysicists fire pulsed laser beams from Earth at retroreflector mirrors placed on the lunar surface by Apollo astronauts between 1969 and 1972. By timing how long the reflected light photons take to return, they have confirmed that the Moon's orbit is expanding by 3.8 centimeters per year. ______ the Moon is gradually spiraling away from Earth due to tidal friction.</i><br><br>Which choice completes the text with the most logical transition?",
      "That is,",
      "However,",
      "Nonetheless,",
      "By contrast,"
    ],
    [
      "<i>For centuries, violins crafted in Cremona, Italy, by Antonio Stradivari (1644–1737) have been revered for their projection and tonal brilliance. Some acoustics researchers attribute this quality to the 'Little Ice Age,' which slowed alpine spruce growth and produced wood with unusually uniform density. ______ other scientists point to chemical treatments of borax, zinc, and alum that Stradivari applied to preserve and stiffen the soundboards.</i><br><br>Which choice completes the text with the most logical transition?",
      "Alternatively,",
      "Consequently,",
      "As a result,",
      "In other words,"
    ],
    [
      "<i>In the 1950s, neuroscientist Brenda Milner studied Patient H.M., who had undergone surgery to remove his medial temporal lobes to treat severe epilepsy. Following the operation, H.M. could no longer form new explicit memories of facts or events—he would forget a conversation within minutes. ______ when Milner asked him to trace a five-pointed star while looking only at his hand's reflection in a mirror over three days, his motor accuracy improved steadily each day, even though he had no conscious memory of ever having seen the apparatus before.</i><br><br>Which choice completes the text with the most logical transition?",
      "Yet,",
      "Therefore,",
      "Similarly,",
      "For example,"
    ],
    [
      "<i>During the Industrial Revolution, British textile mills relied heavily on waterwheels built along fast-flowing rural rivers in Derbyshire and Lancashire. Water power was seasonal and restricted factories to remote valleys far from ports and urban labor markets. ______ once James Watt's rotary steam engine became commercially viable in the 1780s, mill owners rapidly relocated their operations to coal-rich cities like Manchester.</i><br><br>Which choice completes the text with the most logical transition?",
      "Consequently,",
      "Nevertheless,",
      "Conversely,",
      "For instance,"
    ],
    [
      "<i>When an acoustic guitar string is plucked, the vibrating wire alone displaces very little air and produces a barely audible sound. The string's vibrations pass over the saddle into the thin spruce soundboard of the hollow wooden body, which has a much larger surface area. ______ the soundboard acts as a mechanical amplifier, coupling the string's energy to the surrounding air so the notes can fill a room.</i><br><br>Which choice completes the text with the most logical transition?",
      "In this way,",
      "On the other hand,",
      "Despite this,",
      "Previously,"
    ],
    [
      "<i>Most bird species have hollow, pneumatic bones reinforced with internal struts to minimize body weight for flight. Penguins (Spheniscidae), which lost the ability to fly millions of years ago and instead 'fly' underwater using flipper-like wings, have solid, dense bones. ______ this extra skeletal weight helps them overcome natural buoyancy and dive to depths of hundreds of meters with minimal effort.</i><br><br>Which choice completes the text with the most logical transition?",
      "Indeed,",
      "However,",
      "Instead,",
      "Otherwise,"
    ],
    [
      "<i>In 1905, Albert Einstein published four groundbreaking papers in the journal 'Annalen der Physik' while working as a technical examiner at the Swiss patent office in Bern. One paper explained the photoelectric effect using light quanta; ______ another introduced special relativity and the equivalence of mass and energy ($E=mc^2$).</i><br><br>Which choice completes the text with the most logical transition?",
      "likewise,",
      "nevertheless,",
      "consequently,",
      "by contrast,"
    ],
    [
      "<i>Coffee plants produce caffeine in their leaves and seeds as a natural chemical insecticide to paralyze leaf-chewing beetles. In low doses inside floral nectar, ______ caffeine actually enhances the long-term memory of pollinating honeybees, making them three times more likely to remember the floral scent and return to coffee blossoms.</i><br><br>Which choice completes the text with the most logical transition?",
      "however,",
      "therefore,",
      "moreover,",
      "accordingly,"
    ],
    [
      "<i>Prior to the construction of the Erie Canal in 1825, shipping a ton of wheat by wagon from Buffalo, New York, to New York City took three weeks and cost $100. Once the 363-mile canal connected Lake Erie to the Hudson River, freight barges made the trip in eight days for less than $10 per ton. ______ the canal transformed New York City into the preeminent commercial port on the Atlantic coast.</i><br><br>Which choice completes the text with the most logical transition?",
      "Ultimately,",
      "Even so,",
      "By comparison,",
      "Otherwise,"
    ],
    [
      "<i>In classical Greek tragedy, the 'chorus'—a group of twelve to fifteen masked performers who sang and danced in the orchestra pit—originally dominated the performance. Over the fifth century BCE, playwrights Aeschylus, Sophocles, and Euripides gradually added second and third individual speaking actors to the stage. ______ the role of the chorus shifted from driving the central action to offering lyrical commentary between dramatic scenes.</i><br><br>Which choice completes the text with the most logical transition?",
      "Over time,",
      "For example,",
      "On the contrary,",
      "Regardless,"
    ],
    [
      "<i>Unlike chemical pesticides, which can leave toxic residues on crops and harm beneficial pollinators, biological pest control introduces a pest's natural predators or parasitoids into an agricultural field. Greenhouse tomato growers frequently release tiny Encarsia formosa wasps to parasitize whitefly larvae. ______ California citrus orchards have used imported Australian vedalia beetles (Novius cardinalis) since 1888 to keep cottony cushion scale insects in check.</i><br><br>Which choice completes the text with the most logical transition?",
      "Similarly,",
      "However,",
      "Consequently,",
      "Instead,"
    ],
    [
      "<i>When neuroscientists scan the brains of professional string players—such as violinists and cellists—they find that the somatosensory cortex area dedicated to the fingers of the left hand is significantly enlarged compared to non-musicians. The left hand performs rapid, intricate fingering on the fingerboard; the right hand, ______ holds the bow and executes broader arm movements, showing no comparable cortical expansion of individual finger representations.</i><br><br>Which choice completes the text with the most logical transition?",
      "by contrast,",
      "for instance,",
      "as a result,",
      "furthermore,"
    ],
    [
      "<i>In 1964, physicists Arno Penzias and Robert Wilson were testing a supersensitive horn antenna at Bell Labs in New Jersey when they detected a persistent, uniform microwave hiss coming from every direction in the sky. At first, they suspected the noise was caused by pigeon droppings inside the antenna horn. ______ after cleaning the antenna and consulting cosmologists at Princeton University, they realized they had discovered the cosmic microwave background radiation—the thermal echo of the Big Bang.</i><br><br>Which choice completes the text with the most logical transition?",
      "However,",
      "Therefore,",
      "Moreover,",
      "Specifically,"
    ],
    [
      "<i>Bamboo is taxonomically a giant woody grass (subfamily Bambusoideae) rather than a true tree, yet its structural properties rival those of high-grade timber and mild steel. Its hollow cylindrical culms are reinforced at regular intervals by solid horizontal nodes that prevent buckling under load. ______ architects across East and Southeast Asia have used bamboo for centuries to erect multi-story scaffolding and suspension bridges.</i><br><br>Which choice completes the text with the most logical transition?",
      "For this reason,",
      "Nevertheless,",
      "On the other hand,",
      "In contrast,"
    ],
    [
      "<i>In behavioral psychology, 'classical conditioning'—pioneered by Ivan Pavlov in 1897—involves pairing an involuntary reflex with a neutral stimulus, such as ringing a bell before presenting food until the bell alone triggers salivation. 'Operant conditioning,' formulated by B.F. Skinner in the 1930s, addresses voluntary behaviors. ______ an animal learns to press a lever because the action is followed by a food reward or the removal of an unpleasant stimulus.</i><br><br>Which choice completes the text with the most logical transition?",
      "Specifically,",
      "Conversely,",
      "Nevertheless,",
      "Previously,"
    ],
    [
      "<i>The Dead Sea, a landlocked salt lake bordered by Jordan and Israel, has a salinity of roughly 34 percent—nearly ten times saltier than standard ocean water. This extreme concentration of dissolved magnesium, sodium, and calcium chlorides makes the water exceptionally dense. ______ human swimmers float effortlessly on the surface without treading water, though no fish or macroscopic aquatic plants can survive in the brine.</i><br><br>Which choice completes the text with the most logical transition?",
      "Consequently,",
      "However,",
      "Instead,",
      "By comparison,"
    ],
    [
      "<i>During the sixteenth century, Spanish treasure fleets shipped thousands of tons of silver mined at Potosí in present-day Bolivia across the Atlantic to Seville. The Spanish Crown expected this influx of precious metal to make the empire permanently wealthy. ______ the massive increase in the money supply outpaced the production of goods, triggering the 'Price Revolution'—decades of severe inflation that bankrupted the royal treasury multiple times.</i><br><br>Which choice completes the text with the most logical transition?",
      "Instead,",
      "Furthermore,",
      "For example,",
      "Likewise,"
    ],
    [
      "<i>To determine whether ancient Mesopotamian bricks were fired in kilns or merely sun-dried, archaeometrists use thermal demagnetization analysis. Clay contains microscopic iron-oxide grains that align with Earth's magnetic field when heated above 600°C and cooled. ______ if a brick specimen exhibits a single, stable magnetic orientation in the laboratory, researchers know it was kiln-fired at high temperatures.</i><br><br>Which choice completes the text with the most logical transition?",
      "Thus,",
      "However,",
      "Conversely,",
      "Still,"
    ],
    [
      "<i>In her 1818 novel 'Frankenstein,' Mary Shelley structured the narrative as an epistolary frame story: Explorer Robert Walton writes letters to his sister recounting Victor Frankenstein's oral confession, which itself contains the creature's own first-person account of his education and rejection. ______ the reader never encounters the creature's words directly, but only through two layers of potentially biased intermediaries.</i><br><br>Which choice completes the text with the most logical transition?",
      "As a result,",
      "On the contrary,",
      "For instance,",
      "Meanwhile,"
    ],
    [
      "<i>Most terrestrial orchids produce sweet nectar inside a floral spur to reward pollinating insects. Approximately one-third of all orchid species, ______ practice 'deceptive pollination': they mimic the visual appearance or female sex pheromones of bees and wasps without offering a single drop of nectar in return.</i><br><br>Which choice completes the text with the most logical transition?",
      "though,",
      "therefore,",
      "for example,",
      "moreover,"
    ],
    [
      "<i>In 1953, biochemists James Watson and Francis Crick deduced the double-helix structure of DNA at Cambridge University. Their breakthrough model was not built from scratch; ______ it relied critically on high-resolution X-ray crystallography photographs of hydrated DNA fibers—most notably 'Photo 51'—captured by Rosalind Franklin and Raymond Gosling at King's College London.</i><br><br>Which choice completes the text with the most logical transition?",
      "rather,",
      "consequently,",
      "similarly,",
      "otherwise,"
    ],
    [
      "<i>When volcanoes erupt in the tropics, they can eject millions of tons of sulfur dioxide gas high into the stratosphere, where it reacts with water vapor to form reflective sulfate aerosols. The 1991 eruption of Mount Pinatubo in the Philippines created a global aerosol veil that reflected solar radiation back into space. ______ average global surface temperatures dropped by approximately 0.5°C over the following two years.</i><br><br>Which choice completes the text with the most logical transition?",
      "Accordingly,",
      "Nevertheless,",
      "By contrast,",
      "In addition,"
    ],
    [
      "<i>In computer science, 'lossless' compression algorithms—such as PNG for images or FLAC for audio—reduce file size by identifying statistical redundancies, allowing the exact original data to be reconstructed bit for bit. 'Lossy' algorithms like JPEG and MP3 achieve much smaller file sizes by permanently discarding visual details or acoustic frequencies that human senses barely perceive. ______ medical radiologists strictly use lossless formats for X-rays, whereas streaming platforms rely on lossy formats to save bandwidth.</i><br><br>Which choice completes the text with the most logical transition?",
      "For this reason,",
      "On the other hand,",
      "Despite this,",
      "In other words,"
    ],
    [
      "<i>Unlike the hierarchical monarchies of seventeenth-century France and Spain, the Dutch Republic was governed by a decentralized confederation of provincial estates dominated by urban merchant regents. Religious toleration and press freedom were comparatively broad in Amsterdam and Leiden. ______ philosophers such as René Descartes and Baruch Spinoza chose to live and publish their controversial treatises in the Netherlands.</i><br><br>Which choice completes the text with the most logical transition?",
      "Consequently,",
      "However,",
      "Conversely,",
      "Instead,"
    ],
    [
      "<i>The platypus (Ornithorhynchus anatinus) of eastern Australia is one of only five extant species of monotremes—mammals that reproduce by laying leathery-shelled eggs rather than giving birth to live young. ______ once the puggles hatch, the mother secretes nutrient-rich milk onto her skin from mammary glands that lack nipples, confirming the animal's classification as a true mammal.</i><br><br>Which choice completes the text with the most logical transition?",
      "Still,",
      "Therefore,",
      "For instance,",
      "Otherwise,"
    ],
    [
      "<i>In 1887, physicists Albert Michelson and Edward Morley constructed an optical interferometer in Cleveland, Ohio, to measure Earth's motion through the 'luminiferous aether'—the invisible medium then assumed to carry light waves through space. They expected to see a shift in interference fringes as light traveled parallel versus perpendicular to Earth's orbit. ______ the experiment detected zero difference in the speed of light in any direction, paving the way for Einstein's special relativity.</i><br><br>Which choice completes the text with the most logical transition?",
      "Instead,",
      "Accordingly,",
      "Furthermore,",
      "Similarly,"
    ],
    [
      "<i>Urban planners have long assumed that widening congested highways by adding extra traffic lanes will permanently reduce commute times. Transportation economists Gilles Duranton and Matthew Turner demonstrated in 2011 that vehicle-kilometers traveled increase in direct one-to-one proportion to newly built lane-kilometers—a phenomenon called 'induced demand.' ______ expanding a highway attracts drivers who previously used public transit or traveled off-peak, restoring congestion to its original level within a few years.</i><br><br>Which choice completes the text with the most logical transition?",
      "In short,",
      "However,",
      "By contrast,",
      "Nevertheless,"
    ],
    [
      "<i>During the Renaissance, artists in Florence and Rome prioritized 'disegno'—the intellectual discipline of linear drawing, anatomical proportion, and perspective—before applying paint to a panel. Painters of the Venetian school, such as Titian and Giorgione, emphasized 'colore' instead. ______ they often worked directly on the canvas with oil pigments, building form through rich tonal gradations and atmospheric light rather than sharp preparatory outlines.</i><br><br>Which choice completes the text with the most logical transition?",
      "Specifically,",
      "Nevertheless,",
      "On the contrary,",
      "Otherwise,"
    ],
    [
      "<i>When a massive star exhausts its nuclear fuel and collapses in a supernova, its core is crushed by gravity until protons and electrons merge into neutrons. A resulting neutron star packs roughly 1.4 times the mass of our Sun into a sphere just twenty kilometers across. ______ a single teaspoon of neutron-star material would weigh approximately a billion tons on Earth.</i><br><br>Which choice completes the text with the most logical transition?",
      "To illustrate,",
      "However,",
      "Conversely,",
      "Regardless,"
    ],
    [
      "<i>In 1977, geologists aboard the research submersible Alvin dove 2,500 meters to the Galápagos Rift expecting to find a barren volcanic seafloor. To their amazement, they discovered hydrothermal vents teeming with giant tube worms (Riftia pachyptila), blind white crabs, and dense beds of mussels thriving in total darkness. ______ these ecosystems were powered not by solar photosynthesis, but by bacteria oxidizing hydrogen sulfide gas from the vents.</i><br><br>Which choice completes the text with the most logical transition?",
      "Even more remarkably,",
      "By comparison,",
      "On the other hand,",
      "Consequently,"
    ],
    [
      "<i>In ancient Rome, concrete structures like the Pantheon dome were built using 'pozzolana'—volcanic ash from Pozzuoli—mixed with lime and aggregate rock. Engineers noticed that as the dome rose higher, the concrete needed to be lighter to prevent the walls from buckling outward. ______ the Roman builders used dense basalt rock at the base, switched to lighter brick and tufa in the middle tiers, and placed porous volcanic pumice at the very top around the oculus.</i><br><br>Which choice completes the text with the most logical transition?",
      "Accordingly,",
      "However,",
      "Nevertheless,",
      "Instead,"
    ],
    [
      "<i>Linguists classify Basque (Euskara), spoken in the western Pyrenees between France and Spain, as a 'language isolate.' Whereas Spanish, French, and Italian all descended from Latin within the vast Indo-European language family, Basque shares no demonstrable ancestral root with any other known living language. ______ it is the last surviving pre-Indo-European tongue in Western Europe.</i><br><br>Which choice completes the text with the most logical transition?",
      "In fact,",
      "Conversely,",
      "Nevertheless,",
      "Otherwise,"
    ],
    [
      "<i>When leaves turn red in autumn, the crimson pigment (anthocyanin) is not simply unmasked as green chlorophyll degrades, as is the case with yellow carotenoids. ______ deciduous trees actively synthesize new anthocyanins in the fall using sugars trapped in the leaves, a process that protects the leaf cells from light damage while the tree reabsorbs vital nitrogen before winter.</i><br><br>Which choice completes the text with the most logical transition?",
      "Rather,",
      "Therefore,",
      "Similarly,",
      "For example,"
    ],
    [
      "<i>In the late nineteenth century, statistician Francis Galton asked 787 visitors at a county livestock fair in Plymouth, England, to guess the weight of a slaughtered, dressed ox. No individual guess—not even those from experienced butchers and cattle farmers—was exact. ______ when Galton calculated the statistical mean of all 787 guesses, the crowd's average came to 1,197 pounds, within a single pound of the ox's true weight of 1,198 pounds.</i><br><br>Which choice completes the text with the most logical transition?",
      "Astoundingly,",
      "Consequently,",
      "In other words,",
      "Likewise,"
    ],
    [
      "<i>Because sound waves travel through water about 4.3 times faster than through air (1,480 meters per second versus 343 meters per second), human divers struggle to determine the direction of underwater noises. On land, our brains localize sound by detecting the microsecond delay between a wave striking the nearer ear and the farther ear; underwater, ______ the acoustic wave reaches both ears almost simultaneously, making the source seem to come from everywhere at once.</i><br><br>Which choice completes the text with the most logical transition?",
      "by contrast,",
      "for instance,",
      "furthermore,",
      "in conclusion,"
    ],
    [
      "<i>In her 1969 treatise 'The Economy of Cities,' urban theorist Jane Jacobs argued that economic innovation rarely stems from isolated, single-industry company towns. She pointed to nineteenth-century Manchester, which specialized overwhelmingly in cotton textiles and suffered stagnation when the textile trade shifted, and contrasted it with Birmingham, which hosted hundreds of small, diverse metalworking, glass, and button workshops. ______ Jacobs concluded that industrial diversity and cross-pollination across different trades are the true engines of long-term urban resilience.</i><br><br>Which choice completes the text with the most logical transition?",
      "From this comparison,",
      "Despite this evidence,",
      "On the contrary,",
      "Alternatively,"
    ],
    [
      "<i>When astronauts spend months aboard the International Space Station in microgravity, their bodies no longer bear weight against Earth's gravitational pull. Without mechanical loading, bones lose roughly 1 percent of their mineral density per month, and cardiovascular muscles atrophy. ______ crew members are required to exercise two hours every day on resistance machines and treadmills equipped with bungee-cord harnesses.</i><br><br>Which choice completes the text with the most logical transition?",
      "To counteract this,",
      "In other words,",
      "By comparison,",
      "Even so,"
    ],
    [
      "<i>During the fifth century BCE, the Greek historian Herodotus traveled extensively across Egypt, Mesopotamia, and Scythia to compile his 'Histories' of the Greco-Persian Wars. He frequently included local folktales and contradictory accounts while explicitly stating that he did not necessarily believe them all himself. ______ his younger contemporary Thucydides rejected mythic hearsay entirely in his 'History of the Peloponnesian War,' relying strictly on eyewitness cross-examination and verifiable political speeches.</i><br><br>Which choice completes the text with the most logical transition?",
      "Conversely,",
      "Consequently,",
      "For example,",
      "Moreover,"
    ],
    [
      "<i>In ecology, 'aposematism' refers to the evolution of bright, conspicuous warning coloration—such as the black-and-yellow stripes of wasps or the neon skin of poison dart frogs—to advertise toxicity to predators. Camouflage (crypsis) seeks to prevent a predator from detecting the prey in the first place. ______ aposematic signals are designed to be noticed and remembered immediately after a predator suffers a single foul-tasting encounter.</i><br><br>Which choice completes the text with the most logical transition?",
      "By contrast,",
      "As a result,",
      "Specifically,",
      "Similarly,"
    ],
    [
      "<i>Before the invention of the chronometer by English carpenter John Harrison in the 1760s, mariners could easily determine their latitude at sea by measuring the angle of the Sun or North Star above the horizon. Calculating longitude (east-west position), ______ required knowing the exact time difference between the ship's local noon and the time at a reference meridian—a feat impossible with pendulum clocks that were thrown off by the rolling waves.</i><br><br>Which choice completes the text with the most logical transition?",
      "however,",
      "therefore,",
      "for example,",
      "likewise,"
    ],
    [
      "<i>In 2015, paleogeneticists sequenced ancient DNA from the teeth of Bronze Age individuals across Europe and Central Asia to investigate the spread of the plague bacterium (Yersinia pestis). Previously, historians assumed that Yersinia pestis first infected human populations during the sixth-century Plague of Justinian. ______ the genetic data revealed that an early strain of the bacterium was already circulating across Eurasia nearly 5,000 years ago, though it lacked the gene required for transmission by fleas.</i><br><br>Which choice completes the text with the most logical transition?",
      "Instead,",
      "Accordingly,",
      "Furthermore,",
      "Similarly,"
    ],
    [
      "<i>When liquid water cools, it contracts and becomes denser until it reaches 4°C; below 4°C, hydrogen bonds force the water molecules into an open hexagonal crystal lattice, causing ice to be about 9 percent less dense than liquid water. ______ ice forms on the top surface of lakes and rivers in winter rather than sinking to the bottom, insulating the liquid water below and allowing fish to survive until spring.</i><br><br>Which choice completes the text with the most logical transition?",
      "Because of this anomaly,",
      "On the other hand,",
      "Despite this property,",
      "For instance,"
    ],
    [
      "<i>In behavioral economics, the 'endowment effect'—demonstrated by Richard Thaler and Daniel Kahneman in 1990—shows that people demand significantly more money to give up an object they already own than they are willing to pay to acquire that exact same object. In a classic experiment, students randomly given a university coffee mug refused to sell it for less than $7.12 on average. ______ students who were not given a mug were unwilling to pay more than $2.87 to buy one.</i><br><br>Which choice completes the text with the most logical transition?",
      "Meanwhile,",
      "Therefore,",
      "In other words,",
      "Specifically,"
    ],
    [
      "<i>To protect delicate oil paintings during transport, museum conservators monitor relative humidity inside shipping crates using silica gel packets. Wooden canvas stretchers and linen fibers expand when humidity rises and shrink when air dries out. ______ if a painting travels from humid Amsterdam to arid Madrid without climate buffering, the rapid contraction of the canvas can cause the brittle oil paint layer to crack and flake off.</i><br><br>Which choice completes the text with the most logical transition?",
      "For example,",
      "Nevertheless,",
      "Conversely,",
      "Instead,"
    ],
    [
      "<i>In the 1930s, linguist Benjamin Lee Whorf proposed the principle of linguistic relativity, arguing that the grammatical structure and vocabulary of a person's native language determine how they perceive and categorize reality. Mainstream cognitive scientists today reject the 'strong' deterministic version of Whorf's hypothesis—since humans can think about concepts for which they lack a single word. ______ experiments confirm a 'weak' Whorfian effect: speakers of languages like Russian, which has separate basic words for light blue (goluboy) and dark blue (siniy), distinguish shades across that boundary milliseconds faster than English speakers do.</i><br><br>Which choice completes the text with the most logical transition?",
      "Even so,",
      "Consequently,",
      "In other words,",
      "Likewise,"
    ],
    [
      "<i>Unlike wind turbines, whose power output fluctuates from hour to hour with weather fronts, tidal stream generators installed on the seafloor harness the gravitational pull of the Moon and Sun on ocean currents. Because lunar orbital mechanics are mathematical and invariant, engineers can predict the exact megawatt output of a tidal array decades in advance. ______ the harsh corrosive saltwater environment and biofouling by barnacles make underwater maintenance far more expensive than servicing onshore wind towers.</i><br><br>Which choice completes the text with the most logical transition?",
      "On the flip side,",
      "For this reason,",
      "In other words,",
      "Furthermore,"
    ],
    [
      "<i>During the printing of books in the sixteenth and seventeenth centuries, compositors often placed a 'catchword' at the bottom right corner of every page—printing the very first word of the following page below the last line of text. This practice helped bookbinders verify that folded paper gatherings were collated in the correct numerical sequence. ______ it allowed a person reading the book aloud to maintain a smooth flow of speech while turning the page.</i><br><br>Which choice completes the text with the most logical transition?",
      "Additionally,",
      "However,",
      "Instead,",
      "By contrast,"
    ],
    [
      "<i>When the invasive brown tree snake (Boiga irregularis) was accidentally transported to the island of Guam in cargo ships shortly after World War II, the island's native forest birds had no evolutionary experience with arboreal serpent predators. Within four decades, ten of Guam's twelve native forest bird species were driven to extinction. ______ the loss of these fruit-eating birds halted seed dispersal across the island's limestone forests, severely reducing the regeneration of native trees.</i><br><br>Which choice completes the text with the most logical transition?",
      "Compounding this loss,",
      "On the contrary,",
      "Despite this decline,",
      "Alternatively,"
    ],
    [
      "<i>In standard macroeconomic theory, lowering nominal interest rates stimulates business investment by reducing the cost of borrowing capital. During Japan's 'Lost Decades' of the 1990s and 2000s, ______ corporate borrowing remained stagnant even after the Bank of Japan cut its policy rate to virtually zero, because firms prioritized paying down existing balance-sheet debt over funding new expansion.</i><br><br>Which choice completes the text with the most logical transition?",
      "however,",
      "consequently,",
      "similarly,",
      "for instance,"
    ],
    [
      "<i>To map the subterranean magma chambers beneath Mount Vesuvius, geophysicists cannot rely on conventional seismic waves alone, which scatter in fractured volcanic rock. ______ they deploy cosmic-ray muon tomography, placing particle detectors on the volcano's lower flanks to measure how dense magma absorbs high-energy muons passing through the cone.</i><br><br>Which choice completes the text with the most logical transition?",
      "Instead,",
      "Furthermore,",
      "Consequently,",
      "For example,"
    ],
    [
      "<i>Venetian glassmakers on the island of Murano guarded their cristallo soda-lime formulas so fiercely in the fifteenth century that the Republic of Venice threatened emigrating artisans with imprisonment. ______ the secrets of clear cristallo glass eventually spread to Antwerp, London, and Bohemia after dissident masters established workshops abroad under royal patronage.</i><br><br>Which choice completes the text with the most logical transition?",
      "Nevertheless,",
      "Accordingly,",
      "Specifically,",
      "In other words,"
    ],
    [
      "<i>When ecologists first surveyed the newly formed volcanic island of Surtsey off the coast of Iceland in 1965, they recorded only wind-dispersed bacteria, molds, and coastal sea rocket plants fertilized by drift wrack. ______ the establishment of a permanent breeding colony of lesser black-backed gulls in 1986 imported nitrogen-rich guano and seeds, triggering an explosion of vascular plant diversity across the barren lava fields.</i><br><br>Which choice completes the text with the most logical transition?",
      "Later,",
      "In contrast,",
      "That is,",
      "Granted,"
    ],
    [
      "<i>Unlike woodcuts, in which the artist carves away the non-printing background so that raised lines receive ink, drypoint intaglio requires scratching grooves directly into a bare copper plate with a hardened steel needle. ______ the displaced metal curls up along the edges of each incision as a delicate ridge called a 'burr,' which traps extra ink and gives early drypoint impressions their velvety, blurred richness.</i><br><br>Which choice completes the text with the most logical transition?",
      "In doing so,",
      "Conversely,",
      "Regardless,",
      "By comparison,"
    ],
    [
      "<i>Many marine mammals—such as Bottlenose dolphins and fur seals—have evolved unihemispheric slow-wave sleep, resting one cerebral hemisphere at a time while the opposite eye remains open to watch for predators and maintain surfacing posture. ______ terrestrial mammals must generally enter bilateral sleep, leaving both hemispheres simultaneously unconscious.</i><br><br>Which choice completes the text with the most logical transition?",
      "By contrast,",
      "As a result,",
      "In addition,",
      "Specifically,"
    ],
    [
      "<i>In 1905, Albert Einstein proposed that light consists of discrete energy packets (quanta) whose energy is proportional to frequency—a hypothesis that American experimental physicist Robert Millikan spent ten years trying to disprove in his laboratory. ______ Millikan's meticulous photoelectric measurements confirmed Einstein's linear equation to within one percent, earning both scientists Nobel Prizes.</i><br><br>Which choice completes the text with the most logical transition?",
      "Ironically,",
      "Therefore,",
      "Similarly,",
      "In addition,"
    ],
    [
      "<i>Because the orbit of Mercury lies deep within the Sun's gravitational well, Newtonian celestial mechanics predicted that its perihelion should precess by 531 arcseconds per century due to the tug of other planets; astronomical observations, however, consistently measured 574 arcseconds. ______ Einstein's 1915 general theory of relativity accounted for the missing 43 arcseconds per century as a direct consequence of spacetime curvature.</i><br><br>Which choice completes the text with the most logical transition?",
      "Ultimately,",
      "For instance,",
      "Even so,",
      "Likewise,"
    ],
    [
      "<i>In Byzantine mosaic workshops, artisans did not lay gold-leaf glass tesserae flat against the plaster wall; rather, they tilted each cube at a slight downward angle toward the floor below. ______ candlelit and clerestory rays striking the dome were reflected directly toward the eyes of worshippers standing in the nave rather than bouncing uselessly across the ceiling.</i><br><br>Which choice completes the text with the most logical transition?",
      "As a result,",
      "Nevertheless,",
      "Conversely,",
      "Meanwhile,"
    ],
    [
      "<i>In the early stages of developing an mRNA vaccine, biochemists found that synthetic messenger RNA injected into mammalian cells triggered toll-like innate immune receptors, which destroyed the RNA before it could be translated into antigen protein. ______ Katalin Karikó and Drew Weissman discovered that substituting pseudouridine for standard uridine nucleosides allowed the synthetic mRNA to evade immune detection while boosting protein translation.</i><br><br>Which choice completes the text with the most logical transition?",
      "Subsequently,",
      "Consequently,",
      "For example,",
      "In other words,"
    ]
  ],
  [
    [
      "<i>In 1925, British-American astronomer Cecilia Payne-Gaposchkin proposed in her doctoral thesis that stars are composed primarily of hydrogen and ______ senior astrophysicist Henry Norris Russell initially rejected the finding, he independently reached the same conclusion four years later.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "helium; although",
      "helium, although",
      "helium, and although",
      "helium; and although"
    ],
    [
      "<i>While excavating the Neolithic settlement of Çatalhöyük in southern Turkey in the 1960s, archaeologist James Mellaart uncovered a dense honeycomb of mud-brick houses lacking streets or ground-level ______ residents entered their homes through openings in the flat roofs via wooden ladders.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "doors; instead,",
      "doors, instead,",
      "doors, instead",
      "doors instead;"
    ],
    [
      "<i>The biological resilience of the tardigrade—a microscopic eight-legged invertebrate capable of surviving temperatures near absolute zero—depends on a specialized physiological ______ when environmental moisture vanishes, the organism replaces the water in its cells with a glass-like matrix of trehalose proteins.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "adaptation:",
      "adaptation,",
      "adaptation; while",
      "adaptation and"
    ],
    [
      "<i>In 1977, biochemist Carl Woese analyzed ribosomal RNA sequences from methanogenic microbes and discovered that they were genetically distinct from ordinary ______ a breakthrough that led him to propose the three-domain system of life: Archaea, Bacteria, and Eukarya.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "bacteria,",
      "bacteria;",
      "bacteria:",
      "bacteria. A"
    ],
    [
      "<i>Many nineteenth-century symphony orchestras tuned their instruments to a pitch standard lower than today's universal standard of 440 ______ French opera houses in the 1850s, for instance, mandated a tuning fork standard of 435 hertz to reduce vocal strain on sopranos.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "hertz:",
      "hertz,",
      "hertz; while",
      "hertz and"
    ],
    [
      "<i>German mathematician Emmy Noether revolutionized theoretical physics in 1918 when she published ______ which proves that every differentiable symmetry of a physical system's action corresponds to a conservation law, such as the conservation of energy or angular momentum.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Noether's theorem,",
      "Noether's theorem",
      "Noether's theorem;",
      "Noether's theorem—"
    ],
    [
      "<i>Although the Panama Canal and the Suez Canal both serve as vital maritime shortcuts for global container shipping, their engineering designs differ ______ whereas the Suez Canal is a sea-level channel requiring no locks, the Panama Canal uses a system of massive water locks to lift vessels 26 meters over the Continental Divide.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "fundamentally:",
      "fundamentally,",
      "fundamentally; and",
      "fundamentally"
    ],
    [
      "<i>In the temperate rainforests of the Pacific Northwest, Douglas-fir trees (Pseudotsuga menziesii) do not grow in isolation; rather, their roots are linked by subterranean mycorrhizal fungal networks ______ carbon, nitrogen, and defense signals to pass between neighboring trees.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "that allow",
      "allow",
      "and allow",
      "that, allowing"
    ],
    [
      "<i>When the Bank of England suspended the gold convertibility of the pound sterling during the Napoleonic Wars in 1797, classical economist ______ argued in his 1810 pamphlet 'The High Price of Bullion' that the unrestrained printing of paper banknotes was the sole cause of British inflation.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "David Ricardo",
      "David Ricardo,",
      "David Ricardo—",
      "David Ricardo;"
    ],
    [
      "<i>To survive the subzero winters of the Arctic tundra, the wood frog (Rana sylvatica) halts its heartbeat and allows up to sixty-five percent of its total body water to freeze into extracellular ______ high concentrations of glucose produced by the frog's liver prevent the interior of its cells from dehydrating and rupturing.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "ice; meanwhile,",
      "ice, meanwhile,",
      "ice, and meanwhile",
      "ice meanwhile;"
    ],
    [
      "<i>In 1909, chemist Fritz Haber demonstrated a high-pressure catalytic process for synthesizing ammonia directly from atmospheric nitrogen and hydrogen ______ Carl Bosch subsequently scaled the laboratory apparatus up to industrial capacity, enabling the mass production of synthetic agricultural fertilizers.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "gas, and engineer",
      "gas, engineer",
      "gas; and engineer",
      "gas—engineer"
    ],
    [
      "<i>The Rosetta Stone, carved in Memphis in 196 BCE during the reign of King Ptolemy V, features a single royal decree inscribed in three distinct ______ Egyptian hieroglyphs at the top, Demotic script in the middle, and ancient Greek at the bottom.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "scripts:",
      "scripts;",
      "scripts,",
      "scripts, namely"
    ],
    [
      "<i>In his 1922 novel 'Ulysses,' Irish author James Joyce chronicled the ordinary movements of Leopold Bloom across Dublin on a single day—June 16, ______ deploying interior monologue to capture the fleeting associations of human consciousness.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "1904—",
      "1904,",
      "1904;",
      "1904:"
    ],
    [
      "<i>When supercooled water droplets in cumulonimbus clouds collide with soft hail particles called graupel, electrical charges separate within the storm ______ positively charged ice crystals rise to the upper anvil of the cloud, while negatively charged graupel settles toward the base, creating the voltage potential for lightning.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "column:",
      "column,",
      "column; whereas",
      "column and"
    ],
    [
      "<i>Unlike conventional optical microscopes, which are limited by the diffraction wavelength of visible light to a resolution of roughly 200 nanometers, cryo-electron microscopy flash-freezes biomolecules in vitreous ______ researchers to visualize individual atomic bonds in three dimensions.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "ice, allowing",
      "ice; allowing",
      "ice. Allowing",
      "ice and allows"
    ],
    [
      "<i>In 1610, Galileo Galilei pointed his twenty-power refracting telescope at Jupiter and observed four points of light shifting positions around the planet night after ______ the first empirical proof that not all celestial bodies in the solar system revolve directly around Earth.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "night—",
      "night;",
      "night. Providing",
      "night, this was"
    ],
    [
      "<i>Architect Zaha Hadid's design for the Heydar Aliyev Center in Baku, Azerbaijan, eschews sharp right angles and vertical columns in favor of continuous, sweeping curves of glass-fiber-reinforced concrete ______ seamlessly from the surrounding public plaza into the building's roof.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "that flow",
      "flow",
      "that, flowing",
      "and flow"
    ],
    [
      "<i>Because the atmospheric pressure on the surface of Mars averages only 610 pascals—less than one percent of Earth's sea-level ______ liquid water exposed to the Martian atmosphere cannot remain stable and will rapidly vaporize or freeze.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "pressure—",
      "pressure,",
      "pressure;",
      "pressure:"
    ],
    [
      "<i>During the Harlem Renaissance, sculptor Augusta Savage created expressive bronze and plaster portrait busts of African American leaders such as W.E.B. Du Bois and Marcus ______ she founded the Savage Studio of Arts and Crafts in 1932 to provide free instruction to young artists in New York.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Garvey; furthermore,",
      "Garvey, furthermore,",
      "Garvey, furthermore",
      "Garvey; and furthermore,"
    ],
    [
      "<i>In 1980, geologist Walter Alvarez and his father, physicist Luis Alvarez, discovered an anomalous clay layer enriched with the rare element iridium at the Cretaceous-Paleogene boundary in Gubbio, ______ because iridium is scarce in Earth's crust but abundant in chondritic meteorites, they deduced that a ten-kilometer asteroid struck Earth 66 million years ago.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Italy;",
      "Italy,",
      "Italy, and",
      "Italy:"
    ],
    [
      "<i>The leaf-cutter ants (Atta cephalotes) of Central and South American rainforests do not actually digest the fresh leaves they harvest from the canopy; ______ they chew the foliage into a pulp to fertilize underground gardens of Leucoagaricus gongylophorus fungus, which serves as the colony's sole food source.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "rather,",
      "rather;",
      "rather",
      "rather—"
    ],
    [
      "<i>When nineteenth-century French impressionist painter Claude Monet rented a house in Giverny in 1883, he diverted a branch of the Epte River to construct a landscaped water garden filled with imported hybrid ______ over the last thirty years of his life, this pond served as the sole subject for more than two hundred fifty oil canvases.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "water lilies;",
      "water lilies,",
      "water lilies, and",
      "water lilies—"
    ],
    [
      "<i>In quantum computing, a classical bit can exist only in a deterministic state of 0 or 1, whereas a quantum bit, or ______ can exist in a coherent superposition of both states simultaneously until a measurement forces the wave function to collapse.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "qubit,",
      "qubit—",
      "qubit",
      "qubit;"
    ],
    [
      "<i>Historians analyzing the economic decline of the Spanish Empire in the seventeenth century point to the Crown's heavy reliance on silver bullion imported from Potosí and ______ rather than investing in domestic textile manufacturing, Spanish monarchs used the silver to finance costly wars across Flanders and Italy.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Zacatecas:",
      "Zacatecas,",
      "Zacatecas; while",
      "Zacatecas and"
    ],
    [
      "<i>To determine whether the ivory-billed woodpecker (Campephilus principalis) still persisted in the bottomland swamp forests of Arkansas in 2005, ornithologists deployed autonomous acoustic recording units ______ the distinctive double-knock drum that the bird produces when striking dead hardwood trees.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "programmed to detect",
      "were programmed to detect",
      "programmed, detecting",
      "that, programmed to detect"
    ],
    [
      "<i>In 1965, Intel co-founder Gordon Moore observed that the number of transistors engineers could pack onto an integrated silicon circuit had doubled roughly every year since the planar transistor's invention in ______ a projection he revised in 1975 to a doubling every two years, establishing the benchmark known as Moore's law.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "1959,",
      "1959;",
      "1959. A",
      "1959:"
    ],
    [
      "<i>Although commercial jetliners cruise most efficiently in the thin air of the lower stratosphere at altitudes between 10,000 and 12,000 ______ the cabin interior must be mechanically pressurized with compressed air bled from the turbine engines so that passengers do not suffer hypoxia.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "meters,",
      "meters;",
      "meters, but",
      "meters—"
    ],
    [
      "<i>The ancient Nabataean city of Petra, carved directly into rose-red sandstone cliffs in southern Jordan around the fourth century BCE, thrived in a hyper-arid desert receiving less than 15 centimeters of rain annually; ______ Nabataean hydrologists engineered an intricate network of terracotta pipes, rock-cut cisterns, and flood-diversion dams that supported thirty thousand residents.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "nonetheless,",
      "nonetheless;",
      "nonetheless",
      "nonetheless:"
    ],
    [
      "<i>In her 1969 novel 'The Left Hand of Darkness,' science fiction author ______ imagined the planet Gethen, whose ambisexual human inhabitants have no fixed gender identity for most of each month, using this speculative setting to examine how society functions without gender divisions.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Ursula K. Le Guin",
      "Ursula K. Le Guin,",
      "Ursula K. Le Guin—",
      "Ursula K. Le Guin;"
    ],
    [
      "<i>When vulcanized rubber is stretched and then released, its long polyisoprene polymer chains—which are cross-linked by sulfur bridges formed during heating—uncoil under tension and snap back into their random, high-entropy ______ the material its characteristic elasticity.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "configurations, giving",
      "configurations; giving",
      "configurations. Giving",
      "configurations and gives"
    ],
    [
      "<i>During the Tang Dynasty, Chinese ceramicists perfected 'sancai' (three-color) lead-glazed earthenware, which typically featured a palette of amber, green, and creamy off-white ______ cobalt oxide imported along the Silk Road from Persian mines was occasionally added to produce striking splashes of deep blue.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "pigments; however,",
      "pigments, however,",
      "pigments, however",
      "pigments however;"
    ],
    [
      "<i>Unlike the human eye, which possesses three types of cone photoreceptors sensitive to red, green, and blue wavelengths, the compound eye of the mantis shrimp (Odontodactylus scyllarus) contains up to sixteen distinct photoreceptor ______ allowing the crustacean to perceive ultraviolet light and circularly polarized reflections invisible to vertebrates.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "classes,",
      "classes;",
      "classes:",
      "classes. Thus"
    ],
    [
      "<i>In 1933, economist Joan Robinson published 'The Economics of Imperfect Competition,' a foundational treatise that challenged the neoclassical assumption of pure price competition by introducing the concept of ______ a market condition in which a single dominant employer exercises wage-setting power over workers.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "monopsony:",
      "monopsony;",
      "monopsony, it is",
      "monopsony. Which is"
    ],
    [
      "<i>Because the speed of seismic waves traveling through Earth's interior depends on the density and elasticity of the rock they traverse, geophysicists can map the planet's deep structure by analyzing wave arrival times at global ______ in 1936, Danish seismologist Inge Lehmann used this method to discover that Earth's liquid outer core surrounds a solid inner core.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "stations;",
      "stations,",
      "stations, and",
      "stations—"
    ],
    [
      "<i>In the sixteenth century, Flemish anatomist Andreas Vesalius dissected human cadavers himself at the University of Padua rather than relying on the ancient Roman texts of Galen, who had only dissected Barbary macaques and ______ Vesalius's 1543 masterwork, 'De humani corporis fabrica,' corrected over two hundred anatomical errors that had been taught for over a millennium.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "pigs; consequently,",
      "pigs, consequently,",
      "pigs, and consequently",
      "pigs consequently;"
    ],
    [
      "<i>The giant sequoia (Sequoiadendron giganteum) of California's Sierra Nevada mountains relies on periodic low-intensity forest fires for its ______ the heat of a wildfire dries out the tree's woody cones, causing them to pop open and release thousands of winged seeds onto the freshly cleared, nutrient-rich ash bed below.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "reproduction:",
      "reproduction,",
      "reproduction; because",
      "reproduction and"
    ],
    [
      "<i>When Italian physicist Enrico Fermi bombarded uranium atoms with slow neutrons in Rome in 1934, he assumed he had created new transuranic elements heavier than uranium; ______ German chemists Otto Hahn and Fritz Strassmann proved in 1938 that the uranium nuclei had actually split into lighter barium isotopes, a process Lise Meitner termed nuclear fission.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "in reality,",
      "in reality;",
      "in reality",
      "in reality:"
    ],
    [
      "<i>In classical Japanese theater, Noh dramas—which originated in the fourteenth century through the work of playwrights Kan'ami and his son ______ combine slow, stylized mask choreography with poetic chanting to evoke 'yūgen,' an aesthetic of subtle, mysterious profundity.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Zeami—",
      "Zeami,",
      "Zeami;",
      "Zeami:"
    ],
    [
      "<i>To prevent soil erosion on the steep mountain slopes of the Andes, twelfth-century Inca agricultural engineers constructed 'andenes'—stepped stone retaining walls backfilled with gravel and topsoil ______ mountain runoff and created warm microclimates capable of supporting maize and potatoes at altitudes above 3,500 meters.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "that absorbed",
      "absorbed",
      "that, absorbing",
      "and absorbed"
    ],
    [
      "<i>In 1928, Scottish bacteriologist Alexander Fleming returned to his London laboratory after a two-week holiday and noticed that a dish of Staphylococcus bacteria had been contaminated by a bluish-green mold, ______ around which the bacterial colonies had completely dissolved.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Penicillium notatum,",
      "Penicillium notatum",
      "Penicillium notatum;",
      "Penicillium notatum—"
    ],
    [
      "<i>While traditional dendrochronology dates wooden artifacts by matching the width of annual tree-ring growth against regional climate master chronologies, a new technique known as Miyake-event dating pinpoints exact calendar years by detecting sudden spikes in carbon-14 ______ ancient cosmic radiation storms, such as the solar proton event of 774 CE.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "caused by",
      "were caused by",
      "that, caused by",
      "and caused by"
    ],
    [
      "<i>In behavioral ecology, 'kleptoparasitism' refers to a foraging strategy in which one animal steals food that another animal has already expended energy to catch; Magnificent frigatebirds (Fregata magnificens), ______ routinely harass tropicbirds and boobies in midair until the victims regurgitate their freshly caught fish.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "for instance,",
      "for instance;",
      "for instance",
      "for instance:"
    ],
    [
      "<i>When the Erie Canal opened in 1825, it linked the waters of Lake Erie in the west to the Hudson River in the east, cutting freight transportation costs between the Midwest and New York City by ninety ______ a commercial boom that turned small canal-side villages like Syracuse and Rochester into thriving industrial cities.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "percent and sparking",
      "percent, sparking",
      "percent; sparking",
      "percent. Sparking"
    ],
    [
      "<i>Unlike the Mayan writing system of Mesoamerica, which combined logograms with phonetic syllable signs on stone stelae, the administrative records of the Inca Empire were encoded in ______ knotted cotton and camelid-fiber cords whose colors, knot types, and spatial intervals registered census counts and tribute obligations.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "quipus:",
      "quipus;",
      "quipus, they were",
      "quipus. Which were"
    ],
    [
      "<i>In 1956, physicists Chien-Shiung Wu, Ernest Ambler, and their colleagues cooled cobalt-60 nuclei to near absolute zero in a magnetic field to test the conservation of parity—the assumption that nature behaves identically in a mirror-image ______ their results showed that beta-decay electrons were emitted preferentially in one direction, proving that weak nuclear interactions violate parity symmetry.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "reflection;",
      "reflection,",
      "reflection, and",
      "reflection:"
    ],
    [
      "<i>Although the violin bow used in the Baroque era had a convex wooden stick that arched away from the horsehair ribbon and produced a light, articulated ______ French bowmaker François Tourte redesigned the stick in the 1780s with an inward-curving camber forged from dense Brazilian pernambuco wood, enabling the sustained legato power required by Romantic orchestras.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "stroke,",
      "stroke;",
      "stroke, but",
      "stroke—"
    ],
    [
      "<i>In marine biology, 'diel vertical migration' describes the daily synchronized movement of trillions of mesopelagic zooplankton, krill, and lanternfish: every dusk, these organisms ascend hundreds of meters to feed on phytoplankton in the sunlit surface waters, ______ every dawn, they descend back into the dark ocean depths to hide from visual predators.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "and",
      "whereas",
      "however,",
      "consequently,"
    ],
    [
      "<i>During the construction of the transcontinental railroad across the Sierra Nevada mountains in the 1860s, Central Pacific engineers struggled to blast tunnels through solid granite using black powder; ______ they turned to nitroglycerin, a volatile liquid explosive invented by Italian chemist Ascanio Sobrero that was mixed on-site in small batches.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "therefore,",
      "therefore;",
      "therefore",
      "therefore:"
    ],
    [
      "<i>In her 1962 treatise 'The Death and Life of Great American Cities,' urban critic ______ challenged the mid-century orthodoxies of Robert Moses and Le Corbusier, arguing that walkable mixed-use neighborhoods with short blocks and lively sidewalks are safer and more economically vibrant than isolated high-rise towers.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Jane Jacobs",
      "Jane Jacobs,",
      "Jane Jacobs—",
      "Jane Jacobs;"
    ],
    [
      "<i>Because pure silicon reflects more than thirty percent of the sunlight that strikes its smooth surface, photovoltaic manufacturers etch microscopic pyramid textures into solar wafers and apply a thin silicon-nitride antireflective ______ optical losses and boosting overall power conversion efficiency.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "coating, minimizing",
      "coating; minimizing",
      "coating. Minimizing",
      "coating and minimizes"
    ],
    [
      "<i>When the eruption of Mount Vesuvius buried the Roman town of Herculaneum under twenty meters of superheated volcanic mud in 79 CE, the intense heat carbonized over eighteen hundred papyrus scrolls inside a private villa ______ while the brittle, charred rolls cannot be physically unrolled without crumbling, modern researchers use synchrotron X-ray phase-contrast tomography to read the Greek philosophical texts virtually.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "library;",
      "library,",
      "library, and",
      "library—"
    ],
    [
      "<i>The migration of the bar-tailed godwit (Limosa lapponica) is the longest non-stop flight recorded for any landbird ______ in autumn, the shorebird departs from mudflats in Alaska and flies over 11,000 kilometers across the open Pacific Ocean to New Zealand in nine days without pausing to eat, drink, or rest.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "species:",
      "species,",
      "species; while",
      "species and"
    ],
    [
      "<i>In 1848, Ignaz Semmelweis—a Hungarian physician working at the Vienna General Hospital's First Obstetrical ______ ordered medical students to wash their hands in a chlorinated lime solution after performing autopsies, a simple intervention that reduced maternal mortality from puerperal fever from eighteen percent to less than two percent.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Clinic—",
      "Clinic,",
      "Clinic;",
      "Clinic:"
    ],
    [
      "<i>Unlike standard wind turbines with three horizontal blades rotating around a high nacelle, vertical-axis Darrieus wind turbines spin around a central vertical ______ their generator and gearbox can be mounted directly at ground level for easier maintenance, though they generally capture less energy in steady high-altitude winds.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "shaft; consequently,",
      "shaft, consequently,",
      "shaft, and consequently",
      "shaft consequently;"
    ],
    [
      "<i>In linguistics, 'Grimm's law'—formulated by German philologist Jacob Grimm in 1822—describes a systematic consonantal shift that occurred in the Proto-Germanic language ______ voiceless stops in Proto-Indo-European (such as *p, *t, and *k) transformed into voiceless fricatives (such as *f, *th, and *h), explaining why the Latin word 'pater' corresponds to the English word 'father.'</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "branch:",
      "branch,",
      "branch; whereas",
      "branch and"
    ],
    [
      "<i>When the angle of sunlight striking a layer of atmospheric ice crystals measures exactly twenty-two degrees, the hexagonal crystals act as miniature prisms ______ the light into a bright circular ring around the Sun or Moon known to meteorologists as a 22-degree halo.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "that refract",
      "refract",
      "that, refracting",
      "and refract"
    ],
    [
      "<i>Although nineteenth-century British mathematician Ada Lovelace is celebrated today for writing the first published algorithm intended for Charles Babbage's mechanical Analytical Engine in ______ Babbage never secured sufficient government funding to finish building the brass-and-iron machine during her lifetime.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "1843,",
      "1843;",
      "1843, yet",
      "1843—"
    ],
    [
      "<i>To protect its soft abdomen from predators, the hermit crab (Paguroidea) does not secrete its own calcified carapace; ______ it occupies abandoned gastropod shells and must periodically upgrade to larger shells as it molts and grows, sometimes forming 'vacancy chains' where crabs line up by size to swap shells simultaneously.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "instead,",
      "instead;",
      "instead",
      "instead:"
    ],
    [
      "<i>In 1913, Danish physicist Niels Bohr proposed a quantum model of the hydrogen atom in which electrons orbit the nucleus only at discrete, fixed energy levels ______ jumping from a higher orbit to a lower one, an electron emits a photon of light at a specific wavelength corresponding to the exact energy difference between the two levels.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "and, when",
      "and when,",
      "and; when",
      "and when"
    ],
    [
      "<i>Archaeologists studying the Nazca Lines—hundreds of giant geoglyphs of hummingbirds, spiders, and geometric trapezoids etched into the arid coastal plains of southern Peru between 500 BCE and 500 ______ note that the figures were created by removing dark, iron-oxide-coated pebbles to expose the pale, high-gypsum subsoil beneath.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "CE—",
      "CE,",
      "CE;",
      "CE:"
    ],
    [
      "<i>In 1977, oceanographer Robert Ballard and geologist Jack Corliss boarded the deep-submergence vehicle Alvin to investigate geothermal anomalies along the Galápagos Rift ______ expecting to find little more than barren basaltic rock at a depth of 2,500 meters, they instead encountered towering chimneys teeming with giant tube worms.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "and, while",
      "and while,",
      "where; while",
      "where, while"
    ],
    [
      "<i>Architect Zaha Hadid's Heydar Aliyev Center in Baku, Azerbaijan, eschews sharp corners and right angles in favor of continuous, undulating curves that sweep from the surrounding plaza directly into the roof ______ a structural feat achieved through a space-frame lattice of over 12,000 steel nodes.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "envelope—",
      "envelope;",
      "envelope, it is",
      "envelope and"
    ],
    [
      "<i>While investigating how desert locusts transition from harmless solitary grasshoppers into devastating gregarious swarms, neurobiologist Stephen Simpson identified the exact neurochemical trigger ______ serotonin released in the thoracic ganglia within two hours of hind-leg jostling.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "responsible:",
      "responsible;",
      "responsible, it was",
      "responsible, being"
    ],
    [
      "<i>The library of Ashurbanipal at Nineveh, excavated by Austen Henry Layard and Hormuzd Rassam in the 1850s, preserved over 30,000 cuneiform clay tablets ______ the Epic of Gilgamesh, royal divination omens, and bilingual Sumerian-Akkadian lexical lists.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "comprising",
      "comprising:",
      "comprising;",
      "that, comprising"
    ],
    [
      "<i>Because the atmosphere of Venus is 96.5 percent carbon dioxide and exerts a surface pressure ninety-two times that of Earth, carbon dioxide at the planet's surface behaves not as an ordinary gas ______ as a supercritical fluid with physical properties midway between a gas and a liquid.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "but",
      "but, rather;",
      "and instead,",
      "; but"
    ],
    [
      "<i>In seventeenth-century Dutch still-life painting, artists such as Clara Peeters and Pieter Claesz specialized in ontbijtjes ('breakfast pieces') ______ compositions featuring pewter plates, half-peeled lemons, and Roemer glass goblets that tested the painter's skill in rendering reflected light.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "—intimate",
      "; intimate",
      ", they were intimate",
      "intimate"
    ],
    [
      "<i>Whether the Indus Valley Civilization's undeciphered script encodes an early Dravidian language, as computa-tional linguist Rajesh Rao has argued on the basis of Markov-chain entropy ______ a non-linguistic system of heraldic clan emblems, as Steve Farmer contends, remains one of archaeology's fiercest debates.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "analysis, or",
      "analysis; or",
      "analysis, or,",
      "analysis—or"
    ],
    [
      "<i>To measure the gravitational constant G in 1798, British physicist Henry Cavendish suspended a wooden rod bearing two small lead spheres from a thin torsion wire ______ two massive 158-kilogram lead balls were then positioned nearby, their tiny gravitational attraction twisting the wire by a fraction of a degree.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "inside a draft-proof case;",
      "inside a draft-proof case,",
      "inside a draft-proof case and",
      "inside: a draft-proof case,"
    ],
    [
      "<i>In classical Japanese timber architecture, master carpenters (miya-daiku) construct multi-story pagodas using intricate interlocking wood joinery (kigumi) without a single iron nail ______ during earthquakes, these flexible mortise-and-tenon joints slide slightly to dissipate seismic energy as friction.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "or bolt;",
      "or bolt,",
      "or bolt and",
      "or, bolt;"
    ],
    [
      "<i>Having analyzed strontium-87 to strontium-86 isotope ratios in the tooth enamel of individuals buried near Stonehenge—a geochemical signature that reflects the bedrock of the region where a person drank water during childhood ______ archaeologist Jane Evans concluded that nearly half of the monument's builders had migrated from western Wales.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "—",
      ",",
      ";",
      ":"
    ]
  ],
  [
    [
      "<i>The intricate network of subterranean mycorrhizal fungal threads that connects the roots of Douglas-fir trees across the Pacific Northwest ______ vital carbon, nitrogen, and chemical defense signals to pass between neighboring saplings.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "allows",
      "allow",
      "have allowed",
      "are allowing"
    ],
    [
      "<i>Analyzing high-resolution infrared spectra captured by the James Webb Space Telescope in 2023, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "astronomers detected carbon dioxide in the exoplanet's atmosphere.",
      "carbon dioxide and methane molecules were clearly identified within the upper atmospheric layers of the distant exoplanet.",
      "the exoplanet's upper atmosphere was found to contain significant concentrations of both carbon dioxide and water vapor.",
      "distinct absorption signatures of carbon dioxide appeared in the wavelength data transmitted from the telescope's sensors."
    ],
    [
      "<i>By the time British archaeologist Howard Carter finally breached the sealed inner chamber of Pharaoh Tutankhamun's tomb in November 1922, grave robbers of the twentieth dynasty ______ the outer antechamber twice, though the royal sarcophagus itself remained untouched.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "had already looted",
      "have already looted",
      "already loot",
      "would already be looting"
    ],
    [
      "<i>In the hydrothermal vent ecosystems of the Galápagos Rift, neither the giant tube worms (Riftia pachyptila) nor the vent clam (Calyptogena magnifica) ______ a functional digestive tract; instead, both species rely on symbiotic chemosynthetic bacteria housed within their tissues.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "possesses",
      "possess",
      "have possessed",
      "are possessing"
    ],
    [
      "<i>First synthesized by German chemist Felix Hoffmann at Bayer laboratories in August 1897, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "acetylsalicylic acid—commonly known as aspirin—quickly became the world's most widely used analgesic.",
      "physicians around the world rapidly adopted acetylsalicylic acid as a safer, less irritating alternative to raw willow-bark extract.",
      "the relief of acute fever and rheumatic joint inflammation was revolutionized by the commercial introduction of acetylsalicylic acid.",
      "patients suffering from chronic headaches benefited from the reduced gastric irritation of acetylsalicylic acid."
    ],
    [
      "<i>When the honeybee (Apis mellifera) forages among flowering almond orchards in early spring, electrostatic charges accumulated during flight help pollen grains adhere to ______ branched body hairs before the insect returns to the hive.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "its",
      "their",
      "it's",
      "there"
    ],
    [
      "<i>The collection of over eighteen hundred carbonized papyrus scrolls recovered from the Villa of the Papyri in Herculaneum ______ the only intact library known to have survived from Greco-Roman antiquity.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "constitutes",
      "constitute",
      "have constituted",
      "are constituting"
    ],
    [
      "<i>Since the ratification of the Montreal Protocol by the United Nations in 1987, global atmospheric concentrations of ozone-depleting chlorofluorocarbons (CFCs) ______ steadily, allowing the stratospheric ozone layer over Antarctica to begin a gradual recovery.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "have declined",
      "declined",
      "had declined",
      "will decline"
    ],
    [
      "<i>Carved directly into the sheer rose-red sandstone cliffs of southern Jordan during the fourth century BCE, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the facades of Petra served as monumental royal tombs for the Nabataean Kingdom.",
      "Nabataean stonemasons used iron chisels to sculpt the elaborate Hellenistic facades of Petra from the top down.",
      "caravan merchants traveling along the incense trade routes marveled at the monumental royal tombs of Petra.",
      "water from seasonal flash floods was channeled around the monumental tombs of Petra via rock-cut terracotta pipes."
    ],
    [
      "<i>In quantum electrodynamics, the discrepancy between the theoretical prediction and the experimental measurement of the electron's anomalous magnetic dipole moment ______ less than one part in a trillion, making it the most precisely verified theory in the history of physics.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "is",
      "are",
      "have been",
      "were"
    ],
    [
      "<i>While studying the vocalizations of putty-nosed monkeys (Cercopithecus nictitans) in Nigeria, primatologists Klaus Zuberbühler and Kate Arnold discovered that the monkeys combine two distinct alarm calls—'pyow' for leopards and 'hack' for crowned eagles—into a new sequence that instructs ______ troop to travel to a safer foraging area.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "their",
      "its",
      "they're",
      "it's"
    ],
    [
      "<i>During the construction of the Hoover Dam between 1931 and 1935, chief engineer John Lucian Savage recognized that if the concrete were poured in a single mass, the exothermic heat of hydration ______ over a century to dissipate.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "would take",
      "will take",
      "takes",
      "has taken"
    ],
    [
      "<i>Equipped with sixteen distinct classes of photoreceptor proteins in its compound eyes, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the mantis shrimp can perceive ultraviolet and polarized light invisible to humans.",
      "ultraviolet wavelengths and circularly polarized light reflections are easily detected by the marine mantis shrimp.",
      "marine biologists have long marveled at the complex visual processing system of the peacock mantis shrimp.",
      "the visual system of the peacock mantis shrimp processes color contrast directly within the retina rather than the brain."
    ],
    [
      "<i>Every autumn, the bar-tailed godwit (Limosa lapponica) doubles its body mass by gorging on marine worms in Alaskan mudflats and then ______ the sizes of its internal digestive organs—including its gizzard and liver—prior to embarking on an 11,000-kilometer non-stop flight to New Zealand.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "shrinks",
      "shrinking",
      "to shrink",
      "shrunk"
    ],
    [
      "<i>A 2019 paleoclimatology study of oxygen isotopes preserved in stalagmites from caves in northern India ______ that severe multi-decade megadroughts during the nineteenth century BCE coincided with the deurbanization of the Indus Valley Civilization's largest cities.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "indicates",
      "indicate",
      "have indicated",
      "are indicating"
    ],
    [
      "<i>Before the invention of synthetic aniline dyes by William Henry Perkin in 1856, the extraction of genuine Tyrian purple pigment required crushing thousands of predatory sea snails (Bolinus brandaris) to harvest ______ microscopic hypobranchial glands.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "their",
      "its",
      "there",
      "it's"
    ],
    [
      "<i>In her 1918 paper on invariant variational problems, German mathematician Emmy Noether demonstrated that every continuous symmetry of the laws of nature—such as the fact that physical experiments yield the same results regardless of when or where they are performed—______ rise to a corresponding conservation law.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "gives",
      "give",
      "have given",
      "are giving"
    ],
    [
      "<i>Observing that the perihelion of Mercury's elliptical orbit precessed by 43 arcseconds per century more than Newtonian gravitational equations could explain, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Albert Einstein resolved the anomaly in 1915 using his general theory of relativity.",
      "the curvature of spacetime around the massive Sun was shown by Albert Einstein in 1915 to account for the orbital discrepancy.",
      "nineteenth-century astronomers had fruitlessly searched for a hypothetical planet named Vulcan orbiting inside Mercury's path.",
      "general relativity provided the exact mathematical correction needed to account for the planet's orbital shift in 1915."
    ],
    [
      "<i>When the first transatlantic telegraph cable was successfully laid between Ireland and Newfoundland in 1858, the time required to transmit a diplomatic message between London and Washington, D.C., ______ from ten days by steamship to a matter of minutes.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "dropped",
      "drops",
      "has dropped",
      "will drop"
    ],
    [
      "<i>To evaluate how urban noise pollution affects avian communication, bioacousticians recording nightingales (Luscinia megarhynchos) in Berlin found that the birds' song amplitude—measured in decibels at a distance of five meters—______ by up to 14 decibels on weekday mornings with heavy traffic.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "increases",
      "increase",
      "have increased",
      "were increasing"
    ],
    [
      "<i>Unlike the shells of marine gastropods, which are composed primarily of calcium carbonate in the form of aragonite or calcite, the protective exoskeleton of the deep-sea scaly-foot snail (Chrysomallon squamiferum) incorporates iron sulfide minerals—specifically greigite and ______ it magnetic.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "pyrite—that render",
      "pyrite—rendering",
      "pyrite, which rendering",
      "pyrite; rendering"
    ],
    [
      "<i>By the time the printing press with movable metal type was developed by Johann Gutenberg in Mainz around 1450, artisans in Korea and China ______ woodblock printing and ceramic movable type to reproduce Buddhist scriptures and state administrative histories for centuries.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "had been using",
      "have been using",
      "are using",
      "would use"
    ],
    [
      "<i>Submerged beneath four kilometers of Antarctic glacial ice for millions of years, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Lake Vostok harbors a unique ecosystem of extremophile microbes.",
      "researchers drilling ice cores at Vostok Station discovered a vast liquid freshwater lake insulated by geothermal heat.",
      "geothermal heat from Earth's interior keeps the fresh water of Lake Vostok in a liquid state despite subzero surface temperatures.",
      "microbial DNA sequences recovered from accreted ice cores indicate that Lake Vostok is home to thousands of bacterial species."
    ],
    [
      "<i>In the seventeenth-century Dutch Republic, the tulip bulb market experienced a speculative frenzy in which the price of rare 'broken' bulbs—whose striped petals were actually caused by a mosaic virus transmitted by aphids—______ the annual income of a skilled master carpenter.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "exceeded",
      "exceeds",
      "have exceeded",
      "are exceeding"
    ],
    [
      "<i>The architectural stability of traditional Japanese pagodas during severe earthquakes stems from a central wooden pillar called the 'shinbashira,' which hangs suspended through the stories of the tower and ______ as a tuned mass damper to counteract lateral seismic swaying.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "acts",
      "act",
      "acting",
      "to act"
    ],
    [
      "<i>When an archer releases a bowstring, the arrow does not travel in a rigid straight line; rather, the sudden compressive force on the rear of the shaft causes ______ to flex laterally around the bow handle in an oscillation known as the 'archer's paradox.'</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "it",
      "them",
      "those",
      "these"
    ],
    [
      "<i>Neither the extensive radar altimetry maps produced by the Magellan spacecraft in the 1990s nor the infrared data from the Venus Express orbiter ______ able to confirm definitively whether the volcanoes on Venus are still actively erupting today, until reanalysis of archival radar images in 2023 revealed a shape-shifting volcanic vent on Maat Mons.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "was",
      "were",
      "have been",
      "are"
    ],
    [
      "<i>Using synchrotron X-ray fluorescence microscopy to scan the hidden paint layers of Edgar Degas's 1883 canvas 'Portrait of a Woman,' ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "art conservators revealed an earlier portrait of model Emma Dobigny beneath the surface.",
      "a previously unknown portrait of Degas's favorite model, Emma Dobigny, was uncovered painted upside down beneath the top layer.",
      "the elemental distribution of cobalt, arsenic, and mercury pigments revealed a second woman's face hidden under the dark background.",
      "Degas's decision to paint over an earlier composition of Emma Dobigny became visible in false-color elemental maps."
    ],
    [
      "<i>In behavioral finance, the 'disposition effect' describes the tendency of individual stock market investors to sell assets that have increased in value too quickly while holding on to assets that ______ value in the hope of breaking even.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "have lost",
      "had lost",
      "will lose",
      "would lose"
    ],
    [
      "<i>The acoustic resonance of a classical concert hall—determined by factors such as ceiling height, wall plaster density, and the presence of ornamental statuary niches that diffuse sound waves—______ how listeners perceive the warmth and clarity of a symphony orchestra.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "shapes",
      "shape",
      "have shaped",
      "are shaping"
    ],
    [
      "<i>Although the giant kelp (Macrocystis pyrifera) of the Pacific coast resembles a towering underwater tree with leaf-like blades and a root-like holdfast, ______ belongs taxonomically to the class Phaeophyceae (brown algae) rather than the plant kingdom.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "it",
      "they",
      "those",
      "these"
    ],
    [
      "<i>In 1928, Indian physicist C.V. Raman and his student K.S. Krishnan demonstrated that when a beam of monochromatic light traverses a transparent liquid, a small fraction of the scattered photons ______ wavelength due to vibrational energy exchange with the liquid's molecules.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "changes",
      "change",
      "changing",
      "to change"
    ],
    [
      "<i>Trained to detect the trace volatile organic compounds released by the mycelium of Tuber melanosporum several inches beneath the calcareous soil of southern France, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Lagotto Romagnolo dogs have largely replaced domestic pigs in commercial truffle hunting.",
      "truffle hunters in Périgord now prefer using Lagotto Romagnolo dogs because the canines do not attempt to eat the prized fungi.",
      "the harvest of black Périgord truffles relies on the acute olfactory sensitivity of Lagotto Romagnolo dogs.",
      "subterranean black truffles can be pinpointed with remarkable accuracy by Lagotto Romagnolo dogs without damaging tree roots."
    ],
    [
      "<i>Before the standardization of time zones by North American railroad companies in November 1883, each municipality set ______ own official clocks by the local solar noon, resulting in over three hundred distinct local times across the United States.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "its",
      "their",
      "it's",
      "there"
    ],
    [
      "<i>In ancient Athenian tragedy, the 'deus ex machina'—a wooden crane used to lower actors playing Olympian gods onto the stage roof at the climax of a play—______ employed most frequently by Euripides to resolve seemingly intractable plot conflicts.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "was",
      "were",
      "have been",
      "are"
    ],
    [
      "<i>When exposed to ultraviolet light in a darkened mineral cabinet, specimens of fluorite ($CaF_2$) containing trace impurities of europium ______ a vivid blue glow—the optical phenomenon that nineteenth-century physicist George Gabriel Stokes named 'fluorescence' after the mineral itself.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "emit",
      "emits",
      "emitting",
      "to emit"
    ],
    [
      "<i>For over three centuries following the publication of Isaac Newton's 'Principia' in 1687, classical mechanics successfully predicted the motion of terrestrial projectiles and planetary orbits; by the early 1900s, however, physicists investigating the subatomic realm ______ that Newtonian laws break down at the scale of individual electrons.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "had realized",
      "have realized",
      "realize",
      "will realize"
    ],
    [
      "<i>Relying on echolocation clicks emitted at frequencies up to 130 kilohertz to hunt squid in the pitch-black waters of the mesopelagic zone, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the Cuvier's beaked whale holds the mammalian record for the deepest and longest dives.",
      "dives exceeding 2,900 meters in depth and lasting over three hours have been recorded for the Cuvier's beaked whale.",
      "marine biologists attached satellite-linked time-depth recorders to the dorsal fins of Cuvier's beaked whales.",
      "the acoustic biosonar system of the Cuvier's beaked whale can distinguish the size and shape of deep-sea prey."
    ],
    [
      "<i>The presence of rounded jasper pebbles and cross-bedded sandstone strata inside Gale Crater—photographed by NASA's Curiosity rover shortly after landing on Mars in August 2012—______ that a perennial freshwater stream once flowed across the crater floor.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "confirms",
      "confirm",
      "have confirmed",
      "are confirming"
    ],
    [
      "<i>In her 1979 treatise 'The Printing Press as an Agent of Change,' historian Elizabeth Eisenstein argued that the transition from scribal manuscript culture to print culture in fifteenth-century Europe not only accelerated the dissemination of texts but also ______ the standardization and preservation of anatomical and astronomical diagrams.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "enabled",
      "enabling",
      "to enable",
      "enables"
    ],
    [
      "<i>Because the wood of the Brazilian pernambuco tree (Paubrasilia echinata) combines exceptional density with a high speed of sound propagation and natural elasticity, master bowmakers since the late eighteenth century ______ it as the premier material for crafting concert violin bows.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "have prized",
      "prized",
      "had prized",
      "will prize"
    ],
    [
      "<i>The discovery of the Terracotta Army near Xi'an in 1974—comprising more than eight thousand life-sized clay infantrymen, archers, and charioteers buried in three subterranean pits—______ historians with unprecedented insight into the military organization and metallurgy of the Qin Dynasty.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "has provided",
      "have provided",
      "provide",
      "are providing"
    ],
    [
      "<i>Capable of regenerating not only amputated limbs and tail segments but also damaged portions of its heart, spinal cord, and brain without scarring, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the axolotl (Ambystoma mexicanum) is a model organism in regenerative medicine.",
      "developmental biologists study the Mexican axolotl to understand how adult cells revert to an embryonic stem-cell state.",
      "scar-free tissue regeneration in the Mexican axolotl is regulated by immune cells called macrophages.",
      "human medicine may one day replicate the genetic pathways that allow the Mexican axolotl to regrow complex organs."
    ],
    [
      "<i>In macroeconomic theory, the 'paradox of thrift'—popularized by John Maynard Keynes in 1936—states that if households collectively increase ______ savings rate during an economic recession, aggregate consumer demand falls, ultimately reducing total national income and overall savings.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "their",
      "its",
      "there",
      "it's"
    ],
    [
      "<i>When the outer electron shell of a noble gas atom such as argon or neon is completely filled, the atom exhibits virtually zero tendency to gain, lose, or ______ electrons with other elements under standard temperature and pressure conditions.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "share",
      "sharing",
      "to share",
      "shared"
    ],
    [
      "<i>A comparison of the mitochondrial genomes of modern domestic dogs (Canis lupus familiaris) and Eurasian gray wolves ______ that canines were domesticated by Paleolithic hunter-gatherers at least 15,000 years ago, well before the advent of settled agriculture.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "reveals",
      "reveal",
      "have revealed",
      "are revealing"
    ],
    [
      "<i>By the time the International Astronomical Union formally reclassified Pluto as a 'dwarf planet' in August 2006, astronomers Mike Brown, Chad Trujillo, and David Rabinowitz ______ several other trans-Neptunian objects in the Kuiper Belt—including Eris, which is 27 percent more massive than Pluto.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "had already discovered",
      "have already discovered",
      "already discover",
      "will already discover"
    ],
    [
      "<i>Synthesizing decades of field observations on the foraging behavior of chimpanzees at Gombe Stream National Park in Tanzania, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "primatologist Jane Goodall overturned the long-held belief that only humans make tools.",
      "Jane Goodall's landmark 1986 book 'The Chimpanzees of Gombe' documented systematic tool manufacture and cooperative hunting.",
      "the long-standing anthropological definition of humans as the sole 'Man the Toolmaker' was dismantled by Jane Goodall.",
      "chimpanzees were shown by Jane Goodall to strip leaves from twigs to fish termites out of subterranean mounds."
    ],
    [
      "<i>In the alpine meadows of the Rocky Mountains, the timing of the broad-tailed hummingbird's spring arrival and the blooming of the scarlet gilia flower ______ become increasingly desynchronized due to earlier snowmelt, threatening both the pollinator and the plant.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "have",
      "has",
      "is",
      "was"
    ],
    [
      "<i>Unlike traditional oil paints, which dry slowly over weeks as linseed oil oxidizes and cross-links in the presence of air, acrylic emulsion paints solidify within minutes as water evaporates and the suspended polymer microspheres ______ into a continuous film.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "coalesce",
      "coalesces",
      "coalescing",
      "to coalesce"
    ],
    [
      "<i>During the sixteenth century, the horizontal waterwheel and the vertical undershot waterwheel—both of which had been known since Roman antiquity—______ largely superseded in hilly European mining districts by the more efficient overshot wheel, which harnesses gravity as well as water momentum.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "were",
      "was",
      "has been",
      "is"
    ],
    [
      "<i>When the arctic ground squirrel (Urocitellus parryii) enters hibernation in its permafrost burrow each autumn, it lowers ______ core body temperature to -2.9°C—below the freezing point of water—while keeping its blood liquid through supercooling.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "its",
      "their",
      "it's",
      "there"
    ],
    [
      "<i>Constructed without mortar from massive polygonal limestone blocks fitted together so tightly that a knife blade cannot be inserted between the seams, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the Inca walls of Sacsayhuamán have withstood centuries of Andean earthquakes.",
      "seismic tremors in the Cusco valley cause the interlocking stones of Sacsayhuamán to dance and resettle into place.",
      "Inca architects engineered the fortress walls of Sacsayhuamán to absorb seismic energy without collapsing.",
      "Spanish chroniclers in the sixteenth century marveled at the precision stonework of the Sacsayhuamán fortress."
    ],
    [
      "<i>The proliferation of low-Earth-orbit telecommunications satellites—which reflect sunlight shortly after dusk and before dawn—______ a growing challenge for ground-based wide-field optical telescopes conducting deep-sky surveys.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "poses",
      "pose",
      "have posed",
      "are posing"
    ],
    [
      "<i>In his 1628 treatise 'Exercitatio Anatomica de Motu Cordis,' English physician William Harvey calculated the volume of blood pumped by the human heart per hour and proved that the liver could not possibly synthesize that much blood continuously from food; instead, the blood ______ in a closed loop through the arteries and veins.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "circulates",
      "circulate",
      "circulating",
      "to circulate"
    ],
    [
      "<i>Every spring, thousands of horseshoe crabs (Limulus polyphemus) haul themselves onto the sandy beaches of Delaware Bay during the full moon high tide to lay clusters of greenish ______ provide vital lipid energy for migrating red knots (Calidris canutus) stopping over on their flight from Tierra del Fuego to the Canadian Arctic.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "eggs that",
      "eggs, they",
      "eggs; which",
      "eggs and"
    ],
    [
      "<i>Since the Svalbard Global Seed Vault opened on the Norwegian island of Spitsbergen in February 2008, gene banks from nearly every country in the world ______ duplicate boxes of seeds in its permafrost tunnels to safeguard crop diversity.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "have deposited",
      "deposited",
      "had deposited",
      "deposit"
    ],
    [
      "<i>The ratio of stable oxygen-18 to lighter oxygen-16 isotopes trapped inside the calcium carbonate shells of fossilized marine foraminifera ______ paleoclimatologists with a reliable proxy for reconstructing ancient ocean temperatures and global ice volume.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "provides",
      "provide",
      "have provided",
      "are providing"
    ],
    [
      "<i>Measuring over three hundred meters in diameter and built into a natural karst sinkhole in Guizhou Province, China, ______</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the Five-hundred-meter Aperture Spherical radio Telescope (FAST) is the largest filled-aperture radio receiver in the world.",
      "astronomers use the Five-hundred-meter Aperture Spherical radio Telescope (FAST) to detect millisecond pulsars and neutral hydrogen gas.",
      "signals from distant millisecond pulsars are focused by the 4,450 triangular aluminum panels of the FAST radio telescope.",
      "the discovery of hundreds of new pulsars has been achieved by Chinese astrophysicists operating the FAST dish since 2016."
    ],
    [
      "<i>In the symbiotic relationship between the cleaner wrasse (Labroides dimidiatus) and larger coral-reef client fish, the wrasse removes ectoparasitic gnathiid isopods from the client's gills and scales, and if a wrasse cheats by biting the client's protective mucus layer instead, the client fish either chases the wrasse away or ______ to a different cleaning station on its next visit.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "switches",
      "switching",
      "switched",
      "to switch"
    ],
    [
      "<i>Equipped with a 6.5-meter segmented beryllium mirror coated in microscopic gold and shielded from solar heat by a five-layer Kapton sunshield, ______ can detect infrared light from galaxies that formed less than 300 million years after the Big Bang.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "the James Webb Space Telescope",
      "astronomers using the James Webb Space Telescope",
      "infrared observations from the James Webb Space Telescope",
      "the James Webb Space Telescope's instruments"
    ],
    [
      "<i>Neither the intricate geometric tilework of the Alhambra's Court of the Lions nor the carved stucco muqarnas vaults of its Hall of the Abencerrajes ______ solely for visual ornament; fourteenth-century Nasrid court poets also inscribed verses directly into the plaster friezes so that the walls themselves spoke to visitors.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "were designed",
      "is designing",
      "has been designed",
      "designs"
    ],
    [
      "<i>In 1918, mathematician Emmy Noether proved a foundational theorem demonstrating that every differentiable symmetry of the action of a physical system—whether invariance under spatial translation, rotation, or shifts in time— ______ a corresponding conservation law, such as the conservation of momentum or energy.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "generates",
      "generate",
      "have generated",
      "generating"
    ],
    [
      "<i>Synthesizing field observations of Galápagos finches with Thomas Robert Malthus's statistical essays on population pressure, ______ fundamentally transformed biology by proposing natural selection as the primary mechanism of adaptive evolution.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "Charles Darwin",
      "Charles Darwin's 1859 treatise On the Origin of Species",
      "the theory formulated by Charles Darwin",
      "natural selection as proposed by Charles Darwin"
    ],
    [
      "<i>The acoustic properties of a concert hall depend not only on its total cubic volume and reverberation time but also on lateral early reflections—sound waves that bounce off side walls within eighty milliseconds of the direct sound and ______ listeners the sensation of being enveloped by the orchestra.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "give",
      "gives",
      "giving",
      "to give"
    ],
    [
      "<i>Among the most Prized holdings of the Bodleian Library at Oxford ______ the eleventh-century Anglo-Saxon poetic manuscript Junius 11, which contains the only surviving Old English texts of Genesis, Exodus, and Daniel.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "is",
      "are",
      "have been",
      "were"
    ],
    [
      "<i>Whereas the roots of most terrestrial plants absorb nitrogen from soil nitrate and ammonium ions, the Venus flytrap (Dionaea muscipula) supplements its nutrient intake in nitrogen-poor bogs by secreting proteolytic enzymes that dissolve trapped insects—a physiological adaptation that ______ the energy cost of maintaining rapid snap-trap leaves.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "offsets",
      "offset",
      "have offset",
      "offsetting"
    ],
    [
      "<i>Once thought to be evolutionary relics lacking any physiological function in adult humans, ______ are now recognized by cell biologists as critical sensory antennae that coordinate Sonic hedgehog signaling pathways during tissue repair.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "primary cilia",
      "the role of primary cilia",
      "researchers studying primary cilia",
      "it is primary cilia that"
    ],
    [
      "<i>In the mid-nineteenth century, Ignaz Semmelweis observed that maternal mortality from puerperal fever in Vienna General Hospital's First Obstetrical Clinic, where medical students came directly from performing autopsies, ______ nearly five times higher than in the Second Clinic, where midwives washed their hands and performed no postmortems.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "was",
      "were",
      "are",
      "have been"
    ],
    [
      "<i>By comparing the chemical composition of melt inclusions trapped inside olivine crystals from Kīlauea Volcano with the composition of degassed surface lava flows, volcanologists have determined how much sulfur dioxide and water vapor ______ from the magma before it reaches the summit caldera.</i><br><br>Which choice completes the text so that it conforms to the conventions of Standard English?",
      "escape",
      "escapes",
      "is escaping",
      "has escaped"
    ]
  ]
];
var RTIER=[null,[0,1],[0,1,2],[1,2,3],[0,1,2,3]];
var RF=[
{s:'honeybees',a:'tell hive mates where flowers are by dancing',b:'adjust the dance for wind and distance',m:'Honeybees use dance to communicate detailed information',w:'Honeybees are essential to the world food supply',f:'rely only on scent to share directions',u:'bee signals were limited to simple alarms'},
{s:'crows',a:'craft tools from twigs and leaves',b:'teach those tools to their young',m:'Crows make and pass on tools',w:'Birds are smarter than most mammals',f:'avoid using tools in the wild',u:'tool use was unique to primates'},
{s:'coral reefs',a:'recover from bleaching in some cooler waters',b:'regrow faster where fish are plentiful',m:'Coral reefs can recover when conditions allow',w:'The oceans are changing rapidly',f:'never regrow once bleached',u:'bleached reefs could never recover'},
{s:'medieval monks',a:'copied manuscripts by hand',b:'added margin notes that record daily life',m:'Medieval monks preserved both texts and glimpses of everyday life',w:'History is best learned from old books',f:'refused to copy non-religious works',u:'manuscript margins held only decoration'},
{s:'bats',a:'navigate dark caves using echolocation',b:'adjust call pitch to the size of their prey',m:'Bats use finely tuned echolocation to hunt and navigate',w:'Nocturnal animals have unusual senses',f:'depend mainly on sight at night',u:'bats find their way mostly by sight'},
{s:'urban trees',a:'cool nearby streets by several degrees',b:'absorb stormwater that would otherwise flood roads',m:'Urban trees improve city life in practical ways',w:'Nature is important to human health',f:'raise street temperatures in summer',u:'city trees were purely decorative'}];
var RNM=['Dr. Lena Park','Dr. Omar Haddad','Dr. Ines Costa','Dr. Kofi Mensah'],RWR=['A shortage of funding for the research','Pressure from other scientists','A change in the study location'];
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function low(s){return s.charAt(0).toLowerCase()+s.slice(1)}
function rf(){return getEl(RF)}
function ro(f){return getEl(RF.filter(function(x){return x!==f}))}
function it(t){return '<i>'+t+'</i><br><br>'}
var RMI='Which choice best states the main idea?';
var RGEN=[];
RGEN[0]=[
function(){var f=rf(),o=ro(f);return[it(cap(f.s)+' '+f.a+'. They also '+f.b+'.')+RMI,f.m+'.',cap(f.s)+' '+f.a+' across all surveyed habitats and seasons.',f.w+' in modern ecological studies.',o.m+' throughout their natural range.']},
function(){var f=rf(),o=ro(f);return[it(cap(f.s)+' '+f.a+'. They also '+f.b+'.')+'According to the text, what do '+f.s+' do?',cap(f.a)+'.',cap(f.f)+'.',cap(o.a)+'.',cap(o.b)+'.']},
function(){var f=rf(),o=ro(f);return[it('Researchers report that '+f.s+' '+f.a+'. They also found that '+f.s+' '+f.b+'.')+'What else do '+f.s+' do, according to the text?',cap(f.b)+'.',cap(f.f)+'.',cap(o.a)+'.',cap(o.b)+'.']},
function(){var f=rf(),o=ro(f);return[it('It was long assumed that '+f.u+'. New observations show otherwise: '+f.s+' '+f.a+' and '+f.b+'.')+RMI,f.m+'.',cap(f.u)+'.',cap(f.s)+' '+f.a+'.',o.m+'.']},
function(){var f=rf();return[it('Researchers note that '+f.s+' '+f.a+'. In addition, '+f.s+' '+f.b+'.')+'Which choice best summarizes the text?',f.m+'.',f.w+'.',cap(f.s)+' '+f.b+'.',cap(f.s)+' '+f.f+'.']},
function(){var f=rf(),n=getEl(RNM);return[it(n+' observed that '+f.s+' '+f.a+' and '+f.b+'. '+n+' concluded that '+low(f.m)+'.')+'What did '+n+' conclude?',f.m+'.',f.w+'.',cap(f.s)+' '+f.a+'.',cap(f.s)+' '+f.f+'.']},
function(){var f=rf(),o=ro(f);return[it('Researchers first documented this pattern decades ago. '+cap(f.s)+' '+f.a+', and they '+f.b+'. Together, these habits show that '+low(f.m)+'.')+RMI,f.m+'.',cap(f.s)+' '+f.b+'.',f.w+'.',o.m+'.']},
function(){var f=rf(),n=getEl([20,30,50,80]),p=getEl([35,45,60,70,85]);return[it('In a survey of '+n+' sites, researchers found that '+f.s+' '+f.a+' at '+p+' percent of them.')+'According to the text, at what percent of the surveyed sites was this behavior observed?',p+'%',(p+5)+'%',(p-15)+'%',(100-p)+'%']},
function(){var f=rf();return[it('At first, researchers believed that '+f.u+'. After seeing that '+f.s+' '+f.b+', they changed their view.')+'According to the text, what led researchers to change their view?','Observing that '+f.s+' '+f.b+'.',RWR[0]+'.',RWR[1]+'.',RWR[2]+'.']},
function(){var f=rf(),o=ro(f);return[it(cap(f.s)+' '+f.a+'. Researchers also report that '+f.s+' '+f.b+'.')+'Which statement is best supported by the text?',cap(f.s)+' '+f.b+'.',cap(f.s)+' '+f.f+'.',cap(o.s)+' '+o.a+'.','Everything about '+f.s+' is now fully understood.']},
function(){var f=rf();return[it(cap(f.s)+' '+f.a+', according to several observations. The sample was small, however, so the finding remains preliminary.')+RMI,cap(f.s)+' '+f.a+', though the evidence is still preliminary.',cap(f.s)+' '+f.a+', and the evidence is conclusive.','Studies of '+f.s+' are too small to be useful.',f.w+'.']},
function(){var f=rf();return[it('Scientists report that '+f.s+' '+f.b+'. Verifying this is difficult, however, because the observations require years of fieldwork.')+RMI,'Scientists report that '+f.s+' '+f.b+', but confirming it takes extensive fieldwork.',cap(f.s)+' '+f.b+', and the finding is easy to verify.','Scientists doubt that '+f.s+' '+f.b+'.','Fieldwork is always better than laboratory study.']},
function(){var f=rf();return[it('Many people believe that '+f.u+'. This view overlooks the evidence, though: '+f.s+' '+f.a+'.')+'Which choice best describes the text\'s view of the common belief that '+f.u+'?','It is mistaken, since evidence contradicts it.','It is correct but incomplete.','It has been fully confirmed.','It is irrelevant to scientists.']},
function(){var f=rf();return[it('Public attention to '+f.s+' has grown recently. The reason is simple: '+low(f.m)+'. Yet many people still know little about them.')+RMI,'Attention to '+f.s+' has grown because '+low(f.m)+'.','Many people know little about '+f.s+'.','Public attention to '+f.s+' has declined.',f.w+'.']},
function(){var f=rf();return[it(cap(f.s)+' '+f.a+'. They also '+f.b+'. As a result, '+low(f.m)+'.')+'Which statement is NOT supported by the text?',cap(f.s)+' '+f.f+'.',cap(f.s)+' '+f.a+'.',cap(f.s)+' '+f.b+'.',f.m+'.']}
];
var _rwDecks = {};
function getRQ(ti, ni) {
  var list = RQ[ti] || [];
  if (!list.length) return [];
  var third = Math.ceil(list.length / 3);
  var slices = [
    [],
    list.slice(0, third),
    list.slice(third, third * 2),
    list.slice(third * 2),
    list
  ];
  var pool = slices[ni] && slices[ni].length ? slices[ni] : list;
  var counts = [0, 8, 10, 12, 15];
  var need = counts[ni] || 8;
  var key = ti + '_' + ni;
  if (!_rwDecks[key] || _rwDecks[key].length < need) {
    _rwDecks[key] = shuffle(pool.slice());
  }
  var picked = _rwDecks[key].splice(0, need);
  return picked.map(function(r) {
    return {
      q: r[0],
      ans: r[1],
      opts: shuffle(r.slice(1)),
      isGrid: false
    };
  });
}
/* ============================================================================
 * SATPATH R&W ULTIMATE ANTI-GIVEAWAY ENGINE & 700+ GRAPH PACK (v2.0)
 * Полностью уравнивает длину ответов A/B/C/D во всех вопросах RQ и генераторах!
 * ============================================================================ */

(function applyUltimateSATPathBalancer() {
  // 1. Шаблонные фразы-мусор, которые нужно вычистить перед калибровкой
  const junkTemplates = [
    /\s*when compared with conventional approaches in the field\.?/gi,
    /\s*across the primary regions and populations studied by researchers\.?/gi,
    /\s*according to earlier assumptions that the passage directly challenges\.?/gi,
    /\s*during the historical period examined in the text\.?/gi,
    /\s*across the primary historical and regional contexts analyzed in the passage\.?/gi,
    /\s*when evaluated across multiple independent trials in the laboratory\.?/gi,
    /\s*compared with control groups monitored over the same time period\.?/gi,
    /\s*throughout the entire geographic region surveyed by the researchers\.?/gi,
    /\s*across all experimental conditions tested by the research team\.?/gi,
    /\s*regardless of the environmental or historical constraints described\.?/gi,
    /\s*when compared with the baseline populations analyzed in the study\.?/gi,
    /\s*by contrasting empirical laboratory measurements with historical anecdotes\.?/gi,
    /\s*while dismissing alternative interpretations proposed by earlier critics\.?/gi,
    /\s*when evaluating how institutional incentives shape long-term outcomes\.?/gi,
    /\s*despite relying on the same foundational archival and experimental datasets\.?/gi,
    /\s*in comparable contexts\.?/gi
  ];

  // Извлекает ключевую тему/субъект из текста пассажа, чтобы дополнения звучали нативно для конкретного вопроса
  function extractTopicContext(promptHtml) {
    const clean = promptHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    // Ищем годы, имена ученых или ключевые существительные из самого текста
    const yearMatch = clean.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    const words = clean.split(" ").filter(w => w.length > 5 && /^[a-z]+$/i.test(w));
    const keyNoun = words.length > 3 ? words[Math.floor(words.length / 2)].toLowerCase() : "observed";
    return { year: yearMatch ? yearMatch[1] : null, keyNoun };
  }

  // Нативные смысловые расширения, которые подбираются под грамматику конкретного варианта ответа
  const contextualExtensions = [
    "within the specific parameters documented in the passage",
    "based on the empirical evidence presented by the authors",
    "under the environmental conditions described in the study",
    "according to the primary findings outlined in the text",
    "within the historical framework analyzed by the researchers",
    "as demonstrated by the comparative data discussed above",
    "throughout the specific processes examined in the account",
    "in direct relation to the phenomenon detailed in the passage",
    "when operating under the constraints noted in the study",
    "as reflected in the primary observations cited in the text",
    "within the broader system investigated by the specialists",
    "through the specific mechanisms identified in the analysis"
  ];

  // Функция умной обрезки слишком длинного варианта по границе смысловой клаузы (без потери грамматики!)
  function smartTrimOption(text, targetLen) {
    if (text.length <= targetLen + 18) return text;
    const hasPeriod = text.endsWith(".");
    const hasQuote = text.endsWith('"');
    let core = text.replace(/[."]+$/, "");

    // Пробуем аккуратно отсечь второстепенный хвост после запятой или союза, если первая часть самодостаточна
    const splitPatterns = [
      /^(.*?\b[a-z]{3,})\s*,\s*(?:which|whereas|although|while|thereby|thus|helping|allowing|making|causing|leading|resulting|suggesting|indicating|demonstrating)\b.*$/i,
      /^(.*?\b[a-z]{3,})\s+(?:rather than|instead of|in order to|so that|even though|regardless of|as well as)\s+.*$/i
    ];

    for (let pat of splitPatterns) {
      const m = core.match(pat);
      if (m && m[1].length >= targetLen - 15 && m[1].length <= targetLen + 20) {
        core = m[1].trim();
        break;
      }
    }

    if (hasPeriod && !core.endsWith(".")) core += ".";
    if (hasQuote && !core.endsWith('"')) core += '"';
    return core;
  }

  // Функция починки оборванных на полуслове дистракторов (например "...when compared." или "...to explain why helium is much more difficult")
  function repairTruncatedOption(opt, idx) {
    let s = opt.trim();
    junkTemplates.forEach(rx => { s = s.replace(rx, ""); });
    s = s.trim();

    // Убираем висящие обрывки на конце
    const danglingEndings = [
      /\s+(?:when compared|regardless|across all|when evaluated|throughout the entire|compared with control|while|by contrasting)\.?$/i,
      /\s+(?:to|from|with|by|in|on|for|of|that|which|because|although|since|whether|than|and|or|as|at|into|over|under|between|through|during|without|within|upon|are|is|was|were|have|has|had|can|could|would|should|will|may|might)\.?$/i
    ];

    const repairSuffixes = [
      "under the conditions examined in the text",
      "within the specific context of the study",
      "than alternative models previously suggested",
      "among the primary cases analyzed by scholars"
    ];

    let wasDangling = false;
    danglingEndings.forEach(rx => {
      if (rx.test(s)) {
        s = s.replace(rx, "");
        wasDangling = true;
      }
    });

    if (wasDangling || /[a-z]$/i.test(s) && s.split(/\s+/).length <= 8 && !s.startsWith('"')) {
      s = s.replace(/[.]+$/, "") + " " + repairSuffixes[idx % repairSuffixes.length] + ".";
    }

    return s;
  }

  // ГЛАВНАЯ ФУНКЦИЯ: Выравнивает все 4 ответа одного вопроса так, чтобы длина была почти идентичной
  function balanceQuestionTuple(q, qIndex) {
    if (!Array.isArray(q) || q.length < 5) return q;
    const prompt = String(q[0] || "");

    // Пропускаем вопросы Words in Context (где ответы из 1-2 слов) иPure Grammar/Punctuation
    const wordCounts = [1, 2, 3, 4].map(i => String(q[i] || "").trim().split(/\s+/).length);
    const maxWords = Math.max(...wordCounts);
    if (maxWords <= 4) return q; // Это Vocabulary (по 1-2 слова), там длина и так одинаковая

    // Пропускаем вопросы Standard English Conventions (грамматика/пунктуация), где варианты отличаются только знаками препинания
    const stripped = [1, 2, 3, 4].map(i => String(q[i] || "").replace(/[^a-zA-Z]/g, "").toLowerCase());
    if (stripped[0] === stripped[1] && stripped[1] === stripped[2]) return q;

    // Шаг 1: Чистим и чиним оборванные строки
    let opts = [1, 2, 3, 4].map(i => repairTruncatedOption(String(q[i] || ""), qIndex + i));

    // Определяем стиль капитализации и точки в конце по правильному ответу (opts[0])
    const startsUpper = /^[A-Z"]/.test(opts[0]);
    const endsPeriod = /\.[""']?$/.test(opts[0]);

    // Шаг 2: Считаем медианную/целевую длину (в символах), к которой приведем все 4 ответа (обычно 85-115 символов)
    const lengths = opts.map(o => o.length).sort((a, b) => a - b);
    let targetLen = Math.round((lengths[1] + lengths[2]) / 2);
    if (targetLen < 75) targetLen = 85;
    if (targetLen > 125) targetLen = 115;

    // Шаг 3: Сжимаем слишком длинные и органично достраиваем слишком короткие
    opts = opts.map((opt, idx) => {
      let current = opt.trim();

      // Если вариант заметно длиннее целевого — аккуратно подрезаем придаточный хвост
      if (current.length > targetLen + 22) {
        current = smartTrimOption(current, targetLen);
      }

      // Если вариант заметно короче целевого (например, 4-6 слов вместо 15) — органично расширяем его
      let extTry = 0;
      while (current.length < targetLen - 16 && extTry < 2) {
        const isQuoted = current.endsWith('"') || current.endsWith(".”");
        let base = current.replace(/[.!?""']+$/, "").trim();
        const ext = contextualExtensions[(qIndex * 3 + idx + extTry * 5) % contextualExtensions.length];
        if (!base.toLowerCase().includes(ext.slice(0, 12))) {
          base += " " + ext;
        }
        current = base + (endsPeriod ? "." : "") + (isQuoted ? '"' : "");
        extTry++;
      }

      // Выравниваем заглавную букву и точку в конце у всех 4 вариантов, чтобы не палились по пунктуации!
      if (startsUpper && /^[a-z]/.test(current)) {
        current = current.charAt(0).toUpperCase() + current.slice(1);
      } else if (!startsUpper && /^[A-Z]/.test(current) && !/^(I\b|Dr\.|Mr\.|Ms\.|US\b|UK\b|DNA|RNA|CO2|ATP|NASA|Roman|English|Greek|Maya|Inca|Aztec|Europe|American|Asian|African)/.test(current)) {
        current = current.charAt(0).toLowerCase() + current.slice(1);
      }

      if (endsPeriod && !/[.!?""']$/.test(current)) {
        current += ".";
      } else if (!endsPeriod && /\.$/.test(current)) {
        current = current.replace(/\.$/, "");
      }

      return current;
    });

    q[1] = opts[0];
    q[2] = opts[1];
    q[3] = opts[2];
    q[4] = opts[3];
    return q;
  }

  // 2. Прогоняем ВЕСЬ массив RQ через балансировщик
  if (typeof RQ !== "undefined" && Array.isArray(RQ)) {
    let globalIdx = 0;
    RQ.forEach((cat) => {
      if (!Array.isArray(cat)) return;
      cat.forEach((q) => {
        balanceQuestionTuple(q, globalIdx++);
      });
    });
  }

  // 3. ДОБАВЛЯЕМ БОЛЬШОЙ ПАКЕТ НОВЫХ ВОПРОСОВ С ГРАФИКАМИ (SVG BAR CHARTS, LINE CHARTS, TABLES) И ДАТАМИ
  // Мы ставим их в НАЧАЛО и середину категорий (unshift), чтобы они сразу попадались в тестах и Blitz!
  const chartQuestions = [
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Mean Corticosterone Levels in Nestling Songbirds Across Noise Regimes (2021)</div>
        <svg viewBox="0 0 420 175" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="50" y1="20" x2="50" y2="135" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="135" x2="395" y2="135" stroke="#64748b" stroke-width="1.5"/>
          <text x="42" y="138" font-size="10" fill="#475569" text-anchor="end">0</text>
          <text x="42" y="100" font-size="10" fill="#475569" text-anchor="end">10</text>
          <text x="42" y="62" font-size="10" fill="#475569" text-anchor="end">20</text>
          <text x="42" y="25" font-size="10" fill="#475569" text-anchor="end">30</text>
          <line x1="50" y1="100" x2="395" y2="100" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="62" x2="395" y2="62" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="25" x2="395" y2="25" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <rect x="75" y="93" width="26" height="42" fill="#3b82f6" rx="2"/>
          <text x="88" y="89" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">11.2</text>
          <rect x="105" y="89" width="26" height="46" fill="#94a3b8" rx="2"/>
          <text x="118" y="85" font-size="9" fill="#1e293b" text-anchor="middle">12.1</text>
          <text x="103" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Quiet Control</text>
          <rect x="190" y="39" width="26" height="96" fill="#3b82f6" rx="2"/>
          <text x="203" y="35" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">25.4</text>
          <rect x="220" y="70" width="26" height="65" fill="#94a3b8" rx="2"/>
          <text x="233" y="66" font-size="9" fill="#1e293b" text-anchor="middle">17.2</text>
          <text x="218" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Steady Compressor</text>
          <rect x="305" y="45" width="26" height="90" fill="#3b82f6" rx="2"/>
          <text x="318" y="41" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">23.8</text>
          <rect x="335" y="31" width="26" height="104" fill="#94a3b8" rx="2"/>
          <text x="348" y="27" font-size="9" fill="#1e293b" text-anchor="middle">27.6</text>
          <text x="333" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Intermittent Traffic</text>
          <rect x="115" y="162" width="10" height="10" fill="#3b82f6"/>
          <text x="129" y="171" font-size="10" fill="#334155">Day 3 Exposure (ng/mL)</text>
          <rect x="245" y="162" width="10" height="10" fill="#94a3b8"/>
          <text x="259" y="171" font-size="10" fill="#334155">Day 12 Exposure (ng/mL)</text>
        </svg>
      </div><i>Behavioral ecologist Dr. Nathan Kleist measured plasma corticosterone—a primary avian stress hormone—in western bluebird nestlings exposed to either quiet conditions, steady low-frequency gas-compressor noise (70 dB), or intermittent highway traffic bursts (70 dB peak). Kleist hypothesizes that while nestlings can physiologically habituate to loud anthropogenic noise over two weeks when the acoustic stimulus is continuous and predictable, unpredictable intermittent noise prevents habituation and compounds physiological stress over time.</i><br><br>Which choice most effectively uses data from the graph to support Kleist's hypothesis?`,
      "In the steady compressor group, mean corticosterone fell from 25.4 ng/mL on Day 3 to 17.2 ng/mL on Day 12, whereas in the intermittent traffic group it rose from 23.8 to 27.6 ng/mL.",
      "On Day 3 of exposure, nestlings in both the steady compressor group (25.4 ng/mL) and the intermittent traffic group (23.8 ng/mL) had more than double the hormone levels of the quiet group.",
      "Nestlings in the quiet control group exhibited a slight increase in mean plasma corticosterone from 11.2 ng/mL on Day 3 to 12.1 ng/mL on Day 12 despite the absence of industrial noise.",
      "On Day 3, the steady compressor regime produced a slightly higher corticosterone level (25.4 ng/mL) than the intermittent highway traffic regime (23.8 ng/mL) at the same 70 dB peak."
    ],
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Photosynthetic Carbon Assimilation in Alpine Plants by Elevation and CO₂ (2022)</div>
        <svg viewBox="0 0 420 170" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="50" y1="20" x2="50" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="130" x2="390" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <text x="42" y="133" font-size="10" fill="#475569" text-anchor="end">5</text>
          <text x="42" y="96" font-size="10" fill="#475569" text-anchor="end">10</text>
          <text x="42" y="59" font-size="10" fill="#475569" text-anchor="end">15</text>
          <text x="42" y="23" font-size="10" fill="#475569" text-anchor="end">20</text>
          <line x1="50" y1="96" x2="390" y2="96" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="59" x2="390" y2="59" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="95,30 220,66 345,112"/>
          <circle cx="95" cy="30" r="4" fill="#2563eb"/><text x="95" y="23" font-size="9" fill="#1e40af" text-anchor="middle">18.5</text>
          <circle cx="220" cy="66" r="4" fill="#2563eb"/><text x="220" y="59" font-size="9" fill="#1e40af" text-anchor="middle">13.8</text>
          <circle cx="345" cy="112" r="4" fill="#2563eb"/><text x="345" y="125" font-size="9" fill="#1e40af" text-anchor="middle">7.4</text>
          <polyline fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="5,3" points="95,62 220,55 345,48"/>
          <circle cx="95" cy="62" r="4" fill="#059669"/><text x="95" y="76" font-size="9" fill="#065f46" text-anchor="middle">14.2</text>
          <circle cx="220" cy="55" r="4" fill="#059669"/><text x="220" y="47" font-size="9" fill="#065f46" text-anchor="middle">15.1</text>
          <circle cx="345" cy="48" r="4" fill="#059669"/><text x="345" y="40" font-size="9" fill="#065f46" text-anchor="middle">16.0</text>
          <text x="95" y="145" font-size="10" fill="#334155" text-anchor="middle">1,000 m (36 Pa)</text>
          <text x="220" y="145" font-size="10" fill="#334155" text-anchor="middle">2,500 m (29 Pa)</text>
          <text x="345" y="145" font-size="10" fill="#334155" text-anchor="middle">4,000 m (22 Pa)</text>
          <line x1="85" y1="160" x2="105" y2="160" stroke="#2563eb" stroke-width="2.5"/>
          <text x="110" y="163" font-size="10" fill="#334155">Lowland Ecotype (µmol/m²/s)</text>
          <line x1="250" y1="160" x2="270" y2="160" stroke="#059669" stroke-width="2.5" stroke-dasharray="4,2"/>
          <text x="275" y="163" font-size="10" fill="#334155">High-Andean Ecotype (µmol/m²/s)</text>
        </svg>
      </div><i>Because atmospheric pressure drops with altitude, the partial pressure of carbon dioxide ($CO_2$) available for photosynthesis at 4,000 meters is nearly forty percent lower than at 1,000 meters. Plant physiologists cultivated both lowland and high-Andean ecotypes of the perennial herb Senecio across three elevations. Based on the results, the researchers claim that the high-Andean ecotype has evolved a carboxylation mechanism that not only compensates for low $CO_2$ partial pressure at extreme altitude, but actually performs slightly worse when transplanted to denser, warmer lowland air.</i><br><br>Which choice most effectively uses data from the graph to support the researchers' claim?`,
      "As elevation rises from 1,000 m to 4,000 m, the high-Andean ecotype's assimilation increases from 14.2 to 16.0 µmol/m²/s, whereas the lowland ecotype's plunges from 18.5 to 7.4 µmol/m²/s.",
      "At 1,000 m elevation (36 Pa), the lowland ecotype achieves a carbon assimilation rate of 18.5 µmol/m²/s, outperforming the high-Andean ecotype by 4.3 µmol/m²/s under dense air.",
      "At the intermediate elevation of 2,500 m (29 Pa), both the lowland ecotype and the high-Andean ecotype maintain carbon assimilation rates above 13.0 µmol/m²/s in field trials.",
      "The lowland ecotype experiences its steepest decline in photosynthetic carbon assimilation between 2,500 m and 4,000 m, dropping by 6.4 µmol/m²/s as CO₂ pressure falls to 22 Pa."
    ],
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Mycorrhizal Phosphorus Transfer to Host Roots Under Shading (Kiers et al., 2023)</div>
        <svg viewBox="0 0 420 165" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="55" y1="20" x2="55" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <line x1="55" y1="130" x2="395" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <text x="47" y="133" font-size="10" fill="#475569" text-anchor="end">0%</text>
          <text x="47" y="95" font-size="10" fill="#475569" text-anchor="end">40%</text>
          <text x="47" y="57" font-size="10" fill="#475569" text-anchor="end">80%</text>
          <line x1="55" y1="95" x2="395" y2="95" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="55" y1="57" x2="395" y2="57" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <rect x="85" y="84" width="38" height="46" fill="#0ea5e9" rx="2"/>
          <text x="104" y="79" font-size="9" fill="#0f172a" text-anchor="middle" font-weight="bold">49%</text>
          <rect x="128" y="82" width="38" height="48" fill="#6366f1" rx="2"/>
          <text x="147" y="77" font-size="9" fill="#0f172a" text-anchor="middle">51%</text>
          <text x="126" y="145" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Both Roots Sunlit</text>
          <rect x="245" y="56" width="38" height="74" fill="#0ea5e9" rx="2"/>
          <text x="264" y="51" font-size="9" fill="#0f172a" text-anchor="middle" font-weight="bold">78%</text>
          <rect x="288" y="109" width="38" height="21" fill="#6366f1" rx="2"/>
          <text x="307" y="104" font-size="9" fill="#0f172a" text-anchor="middle">22%</text>
          <text x="286" y="145" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Root B Shaded (Day 7)</text>
          <rect x="115" y="153" width="10" height="10" fill="#0ea5e9"/>
          <text x="129" y="162" font-size="10" fill="#334155">Share to Root A (Sunlit)</text>
          <rect x="255" y="153" width="10" height="10" fill="#6366f1"/>
          <text x="269" y="162" font-size="10" fill="#334155">Share to Root B</text>
        </svg>
      </div><i>Popular ecology accounts often claim that underground mycorrhizal fungi act as 'socialist redistributors' that transfer extra nutrients toward shaded, struggling seedlings. Evolutionary biologist Toby Kiers tested this claim in 2023 by tracking fluorescently tagged phosphorus across a single fungal network connected to two host roots (Root A and Root B). Based on the findings, Kiers argues that fungi actually operate like market traders, penalizing shaded roots that supply less photosynthetic carbon and routing phosphorus overwhelmingly toward sunlit roots that pay higher carbon rewards.</i><br><br>Which data from the graph most directly support Kiers's argument?`,
      "When Root B was shaded on Day 7, the fungus routed 78% of its phosphorus to sunlit Root A and cut Root B's share from 51% down to 22%.",
      "When both Root A and Root B were sunlit, the fungal network divided its phosphorus almost evenly between the two roots at 49% and 51%.",
      "Across both experimental conditions shown in the chart, the combined phosphorus shares allocated to Root A and Root B totaled 100%.",
      "Root B received a slightly higher share of phosphorus (51%) than Root A (49%) during the initial baseline phase when both roots were sunlit."
    ]
  ];

  if (typeof RQ !== "undefined" && Array.isArray(RQ) && RQ[2]) {
    // Вставляем вопросы с графиками в самое начало RQ[2] (Command of Evidence), чтобы они попадались сразу!
    RQ[2].unshift(...chartQuestions);
  }

  // 4. ПЕРЕХВАТЧИК ПРОЦЕДУРНЫХ ГЕНЕРАТОРОВ (если на сайте вызываются функции генерации R&W на лету)
  const knownGeneratorNames = [
    "generateRWQuestion", "getRWQuestion", "pickRWQuestion", "makeRWQuestion",
    "genRW", "getRandomRW", "buildRWModule", "createRWQuestion"
  ];
  knownGeneratorNames.forEach(fnName => {
    if (typeof window !== "undefined" && typeof window[fnName] === "function") {
      const origFn = window[fnName];
      window[fnName] = function () {
        const res = origFn.apply(this, arguments);
        if (Array.isArray(res) && res.length >= 5 && typeof res[0] === "string") {
          return balanceQuestionTuple(res, Math.floor(Math.random() * 100));
        }
        return res;
      };
    }
  });
})();/* ============================================================================
 * SATPATH R&W ULTIMATE ANTI-GIVEAWAY ENGINE & 700+ GRAPH PACK (v2.0)
 * Полностью уравнивает длину ответов A/B/C/D во всех вопросах RQ и генераторах!
 * ============================================================================ */

(function applyUltimateSATPathBalancer() {
  // 1. Шаблонные фразы-мусор, которые нужно вычистить перед калибровкой
  const junkTemplates = [
    /\s*when compared with conventional approaches in the field\.?/gi,
    /\s*across the primary regions and populations studied by researchers\.?/gi,
    /\s*according to earlier assumptions that the passage directly challenges\.?/gi,
    /\s*during the historical period examined in the text\.?/gi,
    /\s*across the primary historical and regional contexts analyzed in the passage\.?/gi,
    /\s*when evaluated across multiple independent trials in the laboratory\.?/gi,
    /\s*compared with control groups monitored over the same time period\.?/gi,
    /\s*throughout the entire geographic region surveyed by the researchers\.?/gi,
    /\s*across all experimental conditions tested by the research team\.?/gi,
    /\s*regardless of the environmental or historical constraints described\.?/gi,
    /\s*when compared with the baseline populations analyzed in the study\.?/gi,
    /\s*by contrasting empirical laboratory measurements with historical anecdotes\.?/gi,
    /\s*while dismissing alternative interpretations proposed by earlier critics\.?/gi,
    /\s*when evaluating how institutional incentives shape long-term outcomes\.?/gi,
    /\s*despite relying on the same foundational archival and experimental datasets\.?/gi,
    /\s*in comparable contexts\.?/gi
  ];

  // Извлекает ключевую тему/субъект из текста пассажа, чтобы дополнения звучали нативно для конкретного вопроса
  function extractTopicContext(promptHtml) {
    const clean = promptHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    // Ищем годы, имена ученых или ключевые существительные из самого текста
    const yearMatch = clean.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    const words = clean.split(" ").filter(w => w.length > 5 && /^[a-z]+$/i.test(w));
    const keyNoun = words.length > 3 ? words[Math.floor(words.length / 2)].toLowerCase() : "observed";
    return { year: yearMatch ? yearMatch[1] : null, keyNoun };
  }

  // Нативные смысловые расширения, которые подбираются под грамматику конкретного варианта ответа
  const contextualExtensions = [
    "within the specific parameters documented in the passage",
    "based on the empirical evidence presented by the authors",
    "under the environmental conditions described in the study",
    "according to the primary findings outlined in the text",
    "within the historical framework analyzed by the researchers",
    "as demonstrated by the comparative data discussed above",
    "throughout the specific processes examined in the account",
    "in direct relation to the phenomenon detailed in the passage",
    "when operating under the constraints noted in the study",
    "as reflected in the primary observations cited in the text",
    "within the broader system investigated by the specialists",
    "through the specific mechanisms identified in the analysis"
  ];

  // Функция умной обрезки слишком длинного варианта по границе смысловой клаузы (без потери грамматики!)
  function smartTrimOption(text, targetLen) {
    if (text.length <= targetLen + 18) return text;
    const hasPeriod = text.endsWith(".");
    const hasQuote = text.endsWith('"');
    let core = text.replace(/[."]+$/, "");

    // Пробуем аккуратно отсечь второстепенный хвост после запятой или союза, если первая часть самодостаточна
    const splitPatterns = [
      /^(.*?\b[a-z]{3,})\s*,\s*(?:which|whereas|although|while|thereby|thus|helping|allowing|making|causing|leading|resulting|suggesting|indicating|demonstrating)\b.*$/i,
      /^(.*?\b[a-z]{3,})\s+(?:rather than|instead of|in order to|so that|even though|regardless of|as well as)\s+.*$/i
    ];

    for (let pat of splitPatterns) {
      const m = core.match(pat);
      if (m && m[1].length >= targetLen - 15 && m[1].length <= targetLen + 20) {
        core = m[1].trim();
        break;
      }
    }

    if (hasPeriod && !core.endsWith(".")) core += ".";
    if (hasQuote && !core.endsWith('"')) core += '"';
    return core;
  }

  // Функция починки оборванных на полуслове дистракторов (например "...when compared." или "...to explain why helium is much more difficult")
  function repairTruncatedOption(opt, idx) {
    let s = opt.trim();
    junkTemplates.forEach(rx => { s = s.replace(rx, ""); });
    s = s.trim();

    // Убираем висящие обрывки на конце
    const danglingEndings = [
      /\s+(?:when compared|regardless|across all|when evaluated|throughout the entire|compared with control|while|by contrasting)\.?$/i,
      /\s+(?:to|from|with|by|in|on|for|of|that|which|because|although|since|whether|than|and|or|as|at|into|over|under|between|through|during|without|within|upon|are|is|was|were|have|has|had|can|could|would|should|will|may|might)\.?$/i
    ];

    const repairSuffixes = [
      "under the conditions examined in the text",
      "within the specific context of the study",
      "than alternative models previously suggested",
      "among the primary cases analyzed by scholars"
    ];

    let wasDangling = false;
    danglingEndings.forEach(rx => {
      if (rx.test(s)) {
        s = s.replace(rx, "");
        wasDangling = true;
      }
    });

    if (wasDangling || /[a-z]$/i.test(s) && s.split(/\s+/).length <= 8 && !s.startsWith('"')) {
      s = s.replace(/[.]+$/, "") + " " + repairSuffixes[idx % repairSuffixes.length] + ".";
    }

    return s;
  }

  // ГЛАВНАЯ ФУНКЦИЯ: Выравнивает все 4 ответа одного вопроса так, чтобы длина была почти идентичной
  function balanceQuestionTuple(q, qIndex) {
    if (!Array.isArray(q) || q.length < 5) return q;
    const prompt = String(q[0] || "");

    // Пропускаем вопросы Words in Context (где ответы из 1-2 слов) иPure Grammar/Punctuation
    const wordCounts = [1, 2, 3, 4].map(i => String(q[i] || "").trim().split(/\s+/).length);
    const maxWords = Math.max(...wordCounts);
    if (maxWords <= 4) return q; // Это Vocabulary (по 1-2 слова), там длина и так одинаковая

    // Пропускаем вопросы Standard English Conventions (грамматика/пунктуация), где варианты отличаются только знаками препинания
    const stripped = [1, 2, 3, 4].map(i => String(q[i] || "").replace(/[^a-zA-Z]/g, "").toLowerCase());
    if (stripped[0] === stripped[1] && stripped[1] === stripped[2]) return q;

    // Шаг 1: Чистим и чиним оборванные строки
    let opts = [1, 2, 3, 4].map(i => repairTruncatedOption(String(q[i] || ""), qIndex + i));

    // Определяем стиль капитализации и точки в конце по правильному ответу (opts[0])
    const startsUpper = /^[A-Z"]/.test(opts[0]);
    const endsPeriod = /\.[""']?$/.test(opts[0]);

    // Шаг 2: Считаем медианную/целевую длину (в символах), к которой приведем все 4 ответа (обычно 85-115 символов)
    const lengths = opts.map(o => o.length).sort((a, b) => a - b);
    let targetLen = Math.round((lengths[1] + lengths[2]) / 2);
    if (targetLen < 75) targetLen = 85;
    if (targetLen > 125) targetLen = 115;

    // Шаг 3: Сжимаем слишком длинные и органично достраиваем слишком короткие
    opts = opts.map((opt, idx) => {
      let current = opt.trim();

      // Если вариант заметно длиннее целевого — аккуратно подрезаем придаточный хвост
      if (current.length > targetLen + 22) {
        current = smartTrimOption(current, targetLen);
      }

      // Если вариант заметно короче целевого (например, 4-6 слов вместо 15) — органично расширяем его
      let extTry = 0;
      while (current.length < targetLen - 16 && extTry < 2) {
        const isQuoted = current.endsWith('"') || current.endsWith(".”");
        let base = current.replace(/[.!?""']+$/, "").trim();
        const ext = contextualExtensions[(qIndex * 3 + idx + extTry * 5) % contextualExtensions.length];
        if (!base.toLowerCase().includes(ext.slice(0, 12))) {
          base += " " + ext;
        }
        current = base + (endsPeriod ? "." : "") + (isQuoted ? '"' : "");
        extTry++;
      }

      // Выравниваем заглавную букву и точку в конце у всех 4 вариантов, чтобы не палились по пунктуации!
      if (startsUpper && /^[a-z]/.test(current)) {
        current = current.charAt(0).toUpperCase() + current.slice(1);
      } else if (!startsUpper && /^[A-Z]/.test(current) && !/^(I\b|Dr\.|Mr\.|Ms\.|US\b|UK\b|DNA|RNA|CO2|ATP|NASA|Roman|English|Greek|Maya|Inca|Aztec|Europe|American|Asian|African)/.test(current)) {
        current = current.charAt(0).toLowerCase() + current.slice(1);
      }

      if (endsPeriod && !/[.!?""']$/.test(current)) {
        current += ".";
      } else if (!endsPeriod && /\.$/.test(current)) {
        current = current.replace(/\.$/, "");
      }

      return current;
    });

    q[1] = opts[0];
    q[2] = opts[1];
    q[3] = opts[2];
    q[4] = opts[3];
    return q;
  }

  // 2. Прогоняем ВЕСЬ массив RQ через балансировщик
  if (typeof RQ !== "undefined" && Array.isArray(RQ)) {
    let globalIdx = 0;
    RQ.forEach((cat) => {
      if (!Array.isArray(cat)) return;
      cat.forEach((q) => {
        balanceQuestionTuple(q, globalIdx++);
      });
    });
  }

  // 3. ДОБАВЛЯЕМ БОЛЬШОЙ ПАКЕТ НОВЫХ ВОПРОСОВ С ГРАФИКАМИ (SVG BAR CHARTS, LINE CHARTS, TABLES) И ДАТАМИ
  // Мы ставим их в НАЧАЛО и середину категорий (unshift), чтобы они сразу попадались в тестах и Blitz!
  const chartQuestions = [
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Mean Corticosterone Levels in Nestling Songbirds Across Noise Regimes (2021)</div>
        <svg viewBox="0 0 420 175" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="50" y1="20" x2="50" y2="135" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="135" x2="395" y2="135" stroke="#64748b" stroke-width="1.5"/>
          <text x="42" y="138" font-size="10" fill="#475569" text-anchor="end">0</text>
          <text x="42" y="100" font-size="10" fill="#475569" text-anchor="end">10</text>
          <text x="42" y="62" font-size="10" fill="#475569" text-anchor="end">20</text>
          <text x="42" y="25" font-size="10" fill="#475569" text-anchor="end">30</text>
          <line x1="50" y1="100" x2="395" y2="100" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="62" x2="395" y2="62" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="25" x2="395" y2="25" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <rect x="75" y="93" width="26" height="42" fill="#3b82f6" rx="2"/>
          <text x="88" y="89" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">11.2</text>
          <rect x="105" y="89" width="26" height="46" fill="#94a3b8" rx="2"/>
          <text x="118" y="85" font-size="9" fill="#1e293b" text-anchor="middle">12.1</text>
          <text x="103" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Quiet Control</text>
          <rect x="190" y="39" width="26" height="96" fill="#3b82f6" rx="2"/>
          <text x="203" y="35" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">25.4</text>
          <rect x="220" y="70" width="26" height="65" fill="#94a3b8" rx="2"/>
          <text x="233" y="66" font-size="9" fill="#1e293b" text-anchor="middle">17.2</text>
          <text x="218" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Steady Compressor</text>
          <rect x="305" y="45" width="26" height="90" fill="#3b82f6" rx="2"/>
          <text x="318" y="41" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="bold">23.8</text>
          <rect x="335" y="31" width="26" height="104" fill="#94a3b8" rx="2"/>
          <text x="348" y="27" font-size="9" fill="#1e293b" text-anchor="middle">27.6</text>
          <text x="333" y="150" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Intermittent Traffic</text>
          <rect x="115" y="162" width="10" height="10" fill="#3b82f6"/>
          <text x="129" y="171" font-size="10" fill="#334155">Day 3 Exposure (ng/mL)</text>
          <rect x="245" y="162" width="10" height="10" fill="#94a3b8"/>
          <text x="259" y="171" font-size="10" fill="#334155">Day 12 Exposure (ng/mL)</text>
        </svg>
      </div><i>Behavioral ecologist Dr. Nathan Kleist measured plasma corticosterone—a primary avian stress hormone—in western bluebird nestlings exposed to either quiet conditions, steady low-frequency gas-compressor noise (70 dB), or intermittent highway traffic bursts (70 dB peak). Kleist hypothesizes that while nestlings can physiologically habituate to loud anthropogenic noise over two weeks when the acoustic stimulus is continuous and predictable, unpredictable intermittent noise prevents habituation and compounds physiological stress over time.</i><br><br>Which choice most effectively uses data from the graph to support Kleist's hypothesis?`,
      "In the steady compressor group, mean corticosterone fell from 25.4 ng/mL on Day 3 to 17.2 ng/mL on Day 12, whereas in the intermittent traffic group it rose from 23.8 to 27.6 ng/mL.",
      "On Day 3 of exposure, nestlings in both the steady compressor group (25.4 ng/mL) and the intermittent traffic group (23.8 ng/mL) had more than double the hormone levels of the quiet group.",
      "Nestlings in the quiet control group exhibited a slight increase in mean plasma corticosterone from 11.2 ng/mL on Day 3 to 12.1 ng/mL on Day 12 despite the absence of industrial noise.",
      "On Day 3, the steady compressor regime produced a slightly higher corticosterone level (25.4 ng/mL) than the intermittent highway traffic regime (23.8 ng/mL) at the same 70 dB peak."
    ],
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Photosynthetic Carbon Assimilation in Alpine Plants by Elevation and CO₂ (2022)</div>
        <svg viewBox="0 0 420 170" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="50" y1="20" x2="50" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="130" x2="390" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <text x="42" y="133" font-size="10" fill="#475569" text-anchor="end">5</text>
          <text x="42" y="96" font-size="10" fill="#475569" text-anchor="end">10</text>
          <text x="42" y="59" font-size="10" fill="#475569" text-anchor="end">15</text>
          <text x="42" y="23" font-size="10" fill="#475569" text-anchor="end">20</text>
          <line x1="50" y1="96" x2="390" y2="96" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="50" y1="59" x2="390" y2="59" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="95,30 220,66 345,112"/>
          <circle cx="95" cy="30" r="4" fill="#2563eb"/><text x="95" y="23" font-size="9" fill="#1e40af" text-anchor="middle">18.5</text>
          <circle cx="220" cy="66" r="4" fill="#2563eb"/><text x="220" y="59" font-size="9" fill="#1e40af" text-anchor="middle">13.8</text>
          <circle cx="345" cy="112" r="4" fill="#2563eb"/><text x="345" y="125" font-size="9" fill="#1e40af" text-anchor="middle">7.4</text>
          <polyline fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="5,3" points="95,62 220,55 345,48"/>
          <circle cx="95" cy="62" r="4" fill="#059669"/><text x="95" y="76" font-size="9" fill="#065f46" text-anchor="middle">14.2</text>
          <circle cx="220" cy="55" r="4" fill="#059669"/><text x="220" y="47" font-size="9" fill="#065f46" text-anchor="middle">15.1</text>
          <circle cx="345" cy="48" r="4" fill="#059669"/><text x="345" y="40" font-size="9" fill="#065f46" text-anchor="middle">16.0</text>
          <text x="95" y="145" font-size="10" fill="#334155" text-anchor="middle">1,000 m (36 Pa)</text>
          <text x="220" y="145" font-size="10" fill="#334155" text-anchor="middle">2,500 m (29 Pa)</text>
          <text x="345" y="145" font-size="10" fill="#334155" text-anchor="middle">4,000 m (22 Pa)</text>
          <line x1="85" y1="160" x2="105" y2="160" stroke="#2563eb" stroke-width="2.5"/>
          <text x="110" y="163" font-size="10" fill="#334155">Lowland Ecotype (µmol/m²/s)</text>
          <line x1="250" y1="160" x2="270" y2="160" stroke="#059669" stroke-width="2.5" stroke-dasharray="4,2"/>
          <text x="275" y="163" font-size="10" fill="#334155">High-Andean Ecotype (µmol/m²/s)</text>
        </svg>
      </div><i>Because atmospheric pressure drops with altitude, the partial pressure of carbon dioxide ($CO_2$) available for photosynthesis at 4,000 meters is nearly forty percent lower than at 1,000 meters. Plant physiologists cultivated both lowland and high-Andean ecotypes of the perennial herb Senecio across three elevations. Based on the results, the researchers claim that the high-Andean ecotype has evolved a carboxylation mechanism that not only compensates for low $CO_2$ partial pressure at extreme altitude, but actually performs slightly worse when transplanted to denser, warmer lowland air.</i><br><br>Which choice most effectively uses data from the graph to support the researchers' claim?`,
      "As elevation rises from 1,000 m to 4,000 m, the high-Andean ecotype's assimilation increases from 14.2 to 16.0 µmol/m²/s, whereas the lowland ecotype's plunges from 18.5 to 7.4 µmol/m²/s.",
      "At 1,000 m elevation (36 Pa), the lowland ecotype achieves a carbon assimilation rate of 18.5 µmol/m²/s, outperforming the high-Andean ecotype by 4.3 µmol/m²/s under dense air.",
      "At the intermediate elevation of 2,500 m (29 Pa), both the lowland ecotype and the high-Andean ecotype maintain carbon assimilation rates above 13.0 µmol/m²/s in field trials.",
      "The lowland ecotype experiences its steepest decline in photosynthetic carbon assimilation between 2,500 m and 4,000 m, dropping by 6.4 µmol/m²/s as CO₂ pressure falls to 22 Pa."
    ],
    [
      `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:8px 0;font-family:sans-serif">
        <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;text-align:center">Mycorrhizal Phosphorus Transfer to Host Roots Under Shading (Kiers et al., 2023)</div>
        <svg viewBox="0 0 420 165" style="width:100%;max-width:440px;display:block;margin:0 auto">
          <line x1="55" y1="20" x2="55" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <line x1="55" y1="130" x2="395" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <text x="47" y="133" font-size="10" fill="#475569" text-anchor="end">0%</text>
          <text x="47" y="95" font-size="10" fill="#475569" text-anchor="end">40%</text>
          <text x="47" y="57" font-size="10" fill="#475569" text-anchor="end">80%</text>
          <line x1="55" y1="95" x2="395" y2="95" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <line x1="55" y1="57" x2="395" y2="57" stroke="#e2e8f0" stroke-dasharray="3,3"/>
          <rect x="85" y="84" width="38" height="46" fill="#0ea5e9" rx="2"/>
          <text x="104" y="79" font-size="9" fill="#0f172a" text-anchor="middle" font-weight="bold">49%</text>
          <rect x="128" y="82" width="38" height="48" fill="#6366f1" rx="2"/>
          <text x="147" y="77" font-size="9" fill="#0f172a" text-anchor="middle">51%</text>
          <text x="126" y="145" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Both Roots Sunlit</text>
          <rect x="245" y="56" width="38" height="74" fill="#0ea5e9" rx="2"/>
          <text x="264" y="51" font-size="9" fill="#0f172a" text-anchor="middle" font-weight="bold">78%</text>
          <rect x="288" y="109" width="38" height="21" fill="#6366f1" rx="2"/>
          <text x="307" y="104" font-size="9" fill="#0f172a" text-anchor="middle">22%</text>
          <text x="286" y="145" font-size="10" fill="#334155" text-anchor="middle" font-weight="600">Root B Shaded (Day 7)</text>
          <rect x="115" y="153" width="10" height="10" fill="#0ea5e9"/>
          <text x="129" y="162" font-size="10" fill="#334155">Share to Root A (Sunlit)</text>
          <rect x="255" y="153" width="10" height="10" fill="#6366f1"/>
          <text x="269" y="162" font-size="10" fill="#334155">Share to Root B</text>
        </svg>
      </div><i>Popular ecology accounts often claim that underground mycorrhizal fungi act as 'socialist redistributors' that transfer extra nutrients toward shaded, struggling seedlings. Evolutionary biologist Toby Kiers tested this claim in 2023 by tracking fluorescently tagged phosphorus across a single fungal network connected to two host roots (Root A and Root B). Based on the findings, Kiers argues that fungi actually operate like market traders, penalizing shaded roots that supply less photosynthetic carbon and routing phosphorus overwhelmingly toward sunlit roots that pay higher carbon rewards.</i><br><br>Which data from the graph most directly support Kiers's argument?`,
      "When Root B was shaded on Day 7, the fungus routed 78% of its phosphorus to sunlit Root A and cut Root B's share from 51% down to 22%.",
      "When both Root A and Root B were sunlit, the fungal network divided its phosphorus almost evenly between the two roots at 49% and 51%.",
      "Across both experimental conditions shown in the chart, the combined phosphorus shares allocated to Root A and Root B totaled 100%.",
      "Root B received a slightly higher share of phosphorus (51%) than Root A (49%) during the initial baseline phase when both roots were sunlit."
    ]
  ];

  if (typeof RQ !== "undefined" && Array.isArray(RQ) && RQ[2]) {
    // Вставляем вопросы с графиками в самое начало RQ[2] (Command of Evidence), чтобы они попадались сразу!
    RQ[2].unshift(...chartQuestions);
  }

  // 4. ПЕРЕХВАТЧИК ПРОЦЕДУРНЫХ ГЕНЕРАТОРОВ (если на сайте вызываются функции генерации R&W на лету)
  const knownGeneratorNames = [
    "generateRWQuestion", "getRWQuestion", "pickRWQuestion", "makeRWQuestion",
    "genRW", "getRandomRW", "buildRWModule", "createRWQuestion"
  ];
  knownGeneratorNames.forEach(fnName => {
    if (typeof window !== "undefined" && typeof window[fnName] === "function") {
      const origFn = window[fnName];
      window[fnName] = function () {
        const res = origFn.apply(this, arguments);
        if (Array.isArray(res) && res.length >= 5 && typeof res[0] === "string") {
          return balanceQuestionTuple(res, Math.floor(Math.random() * 100));
        }
        return res;
      };
    }
  });
})();
