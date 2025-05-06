import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Prirodne nauke kroz <span className="text-emerald-600">realne primere</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Projekat Naturale približava fiziku i prirodne nauke učenicima osnovnih i srednjih škola kroz praktične primere i interaktivna predavanja.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/about">Saznaj više</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Link href="/activities">Naše aktivnosti</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -left-10 -top-10 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative shadow-2xl rounded-2xl overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 w-full h-full bg-gray-100">
                  {/* Replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Placeholder za hero sliku
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Šta nudi Naturale projekat?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Inovativni pristup učenju prirodnih nauka koji spaja teoriju i praksu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <CardTitle>Interaktivna predavanja</CardTitle>
                <CardDescription>
                  Edukativni sadržaj prilagođen učenicima različitih uzrasta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Naši stručnjaci vode dinamična predavanja koja podstiču aktivno učešće i kritičko razmišljanje kod učenika.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <CardTitle>Praktične radionice</CardTitle>
                <CardDescription>
                  Učenje kroz eksperimente i realne primene
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Učenici kroz praktične radionice otkrivaju kako prirodni zakoni funkcionišu u svakodnevnom životu i stvarnom svetu.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <CardTitle>Mentorski program</CardTitle>
                <CardDescription>
                  Individualni pristup i stručno vođstvo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Iskusni mentori pružaju podršku učenicima u razumevanju složenijih koncepata i razvoju naučnog razmišljanja.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Spremni da otkrijete čari nauke?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Pridružite se Naturale projektu i doživite prirodne nauke na nov i uzbudljiv način.
                  Naš tim stručnjaka je tu da vam pomogne u razumevanju sveta oko vas.
                </p>
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/about">Pridruži se</Link>
                </Button>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-emerald-600">
                  <div className="w-full h-full flex items-center justify-center text-white/80">
                    Placeholder za CTA sliku
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 