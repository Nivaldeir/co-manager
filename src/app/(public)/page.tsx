import Link from 'next/link'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent } from '@/src/shared/components/ui/card'
import { CheckCircle, BarChart3, Workflow, Users, TrendingUp, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Workflow className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">CoE Manager</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </Link>
              <Link href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </Link>
              <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Button asChild>
                <Link href="/dashboard">Acessar Painel</Link>
              </Button>
            </nav>
            <Button asChild className="md:hidden">
              <Link href="/dashboard">Entrar</Link>
            </Button>
          </div>
        </div> 
      </header>

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs sm:text-sm font-medium">
                <Shield className="h-4 w-4" />
                Governança de Automação
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground text-balance leading-tight tracking-tight">
                Transforme suas iniciativas de automação
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl mx-auto lg:mx-0">
                Gerencie todo o ciclo de vida das suas automações com visibilidade completa de ROI, fluxos visuais e governança centralizada para múltiplas plataformas.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Começar Agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Ver Recursos</Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 sm:pt-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Automações</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">85%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">ROI Médio</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">200+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Empresas</div>
                </div>
              </div>
            </div>
            <div className="relative max-w-xl mx-auto lg:mx-0 w-full">
              <Card className="border-2 shadow-lg shadow-primary/5">
                <CardContent className="p-6 sm:p-7 lg:p-8">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                        <BarChart3 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Análise de ROI</div>
                        <div className="text-xs text-muted-foreground">Acompanhe economias em tempo real</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shadow-sm">
                        <Workflow className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Fluxos Visuais</div>
                        <div className="text-xs text-muted-foreground">AS-IS vs TO-BE processos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                        <Users className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Multi-Vendor</div>
                        <div className="text-xs text-muted-foreground">AA, Power Automate, UiPath</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-20 bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              Recursos Completos para Governança
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty">
              Tudo que você precisa para gerenciar e otimizar suas iniciativas de automação
            </p>
          </div>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: 'Análise de ROI',
                description: 'Calcule e acompanhe o retorno sobre investimento de cada automação com métricas em tempo real'
              },
              {
                icon: Workflow,
                title: 'Fluxos Visuais',
                description: 'Crie diagramas AS-IS e TO-BE para visualizar processos antes e depois da automação'
              },
              {
                icon: TrendingUp,
                title: 'Priorização Inteligente',
                description: 'Ordene iniciativas por impacto, custo e complexidade para maximizar resultados'
              },
              {
                icon: Users,
                title: 'Gestão Colaborativa',
                description: 'Equipes trabalham juntas com workflows de aprovação e notificações automáticas'
              },
              {
                icon: Shield,
                title: 'Governança Completa',
                description: 'Controle de permissões, auditoria e compliance para todas as automações'
              },
              {
                icon: CheckCircle,
                title: 'Multi-Plataforma',
                description: 'Suporte para Automation Anywhere, Power Automate, UiPath e outras ferramentas'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/70 transition-colors h-full">
                <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4 shadow-sm">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
                Por que escolher o CoE Manager?
              </h2>
              <div className="space-y-4">
                {[
                  'Reduza tempo de implementação de automações em até 60%',
                  'Visibilidade completa do pipeline de iniciativas',
                  'Decisões baseadas em dados com dashboards executivos',
                  'Integração com ferramentas que você já usa',
                  'Onboarding rápido e suporte dedicado'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" asChild className="mt-4">
                <Link href="/dashboard">Começar Gratuitamente</Link>
              </Button>
            </div>
            <Card className="border-2 shadow-lg shadow-primary/5">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6 sm:space-y-7">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">85%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Aumento médio de ROI</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-secondary mb-1 sm:mb-2">60%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Redução no tempo de implementação</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">500+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Automações gerenciadas</div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic leading-relaxed text-pretty">
                      "O CoE Manager transformou como gerenciamos nossas automações. A visibilidade de ROI nos permitiu priorizar melhor nossos investimentos."
                    </p>
                    <p className="text-sm font-medium text-foreground mt-2">— CIO, Empresa Fortune 500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              Pronto para transformar suas automações?
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/90 text-pretty">
              Comece hoje e veja como o CoE Manager pode otimizar seu programa de automação
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">Criar Cotação Agora</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="#features">Saber Mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 sm:py-12 border-t border-border bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Workflow className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CoE Manager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CoE Manager. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
