import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">O Naturale projektu</h1>
        <p className="text-xl text-gray-600 mb-12">
          Inovativni pristup učenju prirodnih nauka koji približava fiziku i druge prirodne nauke učenicima kroz stvarne primere i praktične demonstracije.
        </p>

        <div className="prose prose-emerald lg:prose-lg max-w-none">
          <h2>Naša misija</h2>
          <p>
            Misija Naturale projekta je da inspiriše novu generaciju mladih ljudi da otkriju lepotu i značaj prirodnih nauka kroz inovativni pristup učenju. Verujemo da razumevanje fizike, hemije i biologije može postati dostupno svima kada se složeni koncepti predstave kroz primere iz svakodnevnog života.
          </p>
          <p>
            Želimo da premostimo jaz između teorije i prakse, između učionice i stvarnog sveta, stvarajući obrazovno okruženje u kojem učenici mogu da vide, dodirnu i razumeju naučne fenomene koji oblikuju svet oko nas.
          </p>

          <Separator className="my-10" />

          <h2>Naša vizija</h2>
          <p>
            Vizija Naturale projekta je da postane vodeća obrazovna inicijativa koja će transformisati način na koji se prirodne nauke predaju u školama širom Srbije, a zatim i regiona. Težimo ka tome da svaki učenik, bez obzira na prethodno znanje ili sklonosti, može da razvije strast prema prirodnim naukama kroz naš program.
          </p>
          <p>
            Dugoročno, naša vizija je stvaranje društva u kojem će naučna pismenost biti deo opšte kulture, a mladi će biti motivisani da svoje karijere grade u STEM oblastima, doprinoseći tako tehnološkom i naučnom napretku naše zemlje.
          </p>

          <Separator className="my-10" />

          <h2>Naši ciljevi</h2>
          <ul>
            <li>
              <strong>Podsticanje interesovanja za nauku</strong> - Kroz interaktivne radionice i eksperimente, želimo da probudimo prirodnu radoznalost kod učenika i pokažemo im da nauka može biti uzbudljiva i zabavna.
            </li>
            <li>
              <strong>Razvijanje kritičkog mišljenja</strong> - Učenici se podstiču da postavljaju pitanja, analiziraju podatke i izvode zaključke, razvijajući tako veštine kritičkog razmišljanja koje su ključne u nauci i šire.
            </li>
            <li>
              <strong>Povezivanje teorije i prakse</strong> - Demonstriramo kako se naučni principi primenjuju u stvarnom svetu, pokazujući relevantnost nauke u svakodnevnom životu i različitim profesijama.
            </li>
            <li>
              <strong>Izgradnja zajednice</strong> - Stvaramo mrežu nastavnika, naučnika, studenata i entuzijasta koji dele strast prema nauci i obrazovanju, omogućavajući razmenu ideja i resursa.
            </li>
            <li>
              <strong>Osnaživanje nastavnika</strong> - Pružamo podršku i resurse nastavnicima da unaprede svoju praksu i implementiraju inovativne metode u nastavi prirodnih nauka.
            </li>
          </ul>

          <Separator className="my-10" />

          <h2>Naša metodologija</h2>
          <p>
            Naturale projekat koristi metodologiju zasnovanu na istraživačkom pristupu učenju (inquiry-based learning), gde učenici aktivno učestvuju u procesu otkrivanja naučnih koncepata. Naše aktivnosti i materijali su dizajnirani tako da:
          </p>
          <ul>
            <li>Podstiču aktivno učešće i eksperimentisanje</li>
            <li>Predstavljaju naučne koncepte kroz realne, svakodnevne primere</li>
            <li>Prilagođavaju sadržaj različitim nivoima znanja i uzrastima</li>
            <li>Integrišu različite naučne discipline i pokazuju njihovu međupovezanost</li>
            <li>Razvijaju i tehničke i socijalne veštine kroz timski rad i komunikaciju</li>
          </ul>
          
          <p>
            Verujemo da je ovaj pristup ključan za stvaranje dubokog razumevanja i dugotrajnog interesovanja za prirodne nauke među mladima.
          </p>
        </div>
      </div>
    </div>
  );
} 