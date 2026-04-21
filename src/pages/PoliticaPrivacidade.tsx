import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h1 className="font-display text-3xl md:text-5xl text-primary mb-4">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Última atualização: abril de 2026
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">1. Quem somos</h2>
            <p className="text-muted-foreground leading-relaxed">
              A <strong>Conexão Norte Bovino (CNB)</strong> é uma plataforma de marketplace de lotes bovinos,
              com sede no Tocantins, Brasil. Conectamos compradores e vendedores de gado com curadoria
              profissional, facilitando negociações seguras e eficientes no agronegócio brasileiro.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos
              os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">2. Dados que coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Coletamos apenas os dados necessários para prestar nossos serviços:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Dados de identificação:</strong> nome completo</li>
              <li><strong>Dados de contato:</strong> número de telefone/WhatsApp e endereço de e-mail</li>
              <li><strong>Dados de localização:</strong> estado e cidade</li>
              <li><strong>Dados agropecuários:</strong> categoria do animal, raça, número de cabeças e informações adicionais sobre o lote</li>
              <li><strong>Dados de navegação:</strong> cookies analíticos para melhoria da plataforma (via Meta Pixel e Google Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">3. Como usamos seus dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Conectar compradores e vendedores de lotes bovinos</li>
              <li>Entrar em contato via WhatsApp para dar continuidade às negociações</li>
              <li>Validar e estruturar anúncios de lotes com curadoria profissional</li>
              <li>Enviar informações relevantes sobre o programa de indicação (se cadastrado)</li>
              <li>Melhorar a experiência da plataforma com base em dados de navegação agregados</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              A base legal para o tratamento é o seu <strong>consentimento expresso</strong> (Art. 7º, I da LGPD),
              obtido no momento do preenchimento dos formulários da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">4. Compartilhamento de dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Não vendemos nem cedemos seus dados a terceiros para fins comerciais. O compartilhamento
              ocorre apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Supabase:</strong> plataforma de banco de dados segura utilizada para
                armazenar os dados coletados nos formulários
              </li>
              <li>
                <strong>WhatsApp (Meta):</strong> meio de comunicação utilizado para dar sequência
                ao contato comercial após o preenchimento do formulário
              </li>
              <li>
                <strong>Autoridades competentes:</strong> quando exigido por lei ou ordem judicial
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">5. Armazenamento e segurança</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os dados são armazenados em servidores seguros da Supabase, com criptografia em
              trânsito (TLS) e em repouso. Adotamos práticas de segurança adequadas para proteger
              suas informações contra acesso não autorizado, perda ou divulgação indevida.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Os dados são mantidos pelo tempo necessário para a prestação do serviço ou até
              que você solicite a exclusão.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies e tecnologias similares para fins analíticos, incluindo o
              <strong> Meta Pixel</strong> (Facebook) e ferramentas de rastreamento de navegação.
              Esses dados são utilizados de forma agregada para entender o comportamento dos
              visitantes e melhorar nossa plataforma. Você pode desativar cookies nas configurações
              do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">7. Seus direitos</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Acesso:</strong> solicitar confirmação de que tratamos seus dados e obter uma cópia</li>
              <li><strong>Correção:</strong> pedir a correção de dados incompletos ou desatualizados</li>
              <li><strong>Exclusão:</strong> solicitar a eliminação dos seus dados, quando aplicável</li>
              <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento</li>
              <li><strong>Portabilidade:</strong> solicitar a transferência dos seus dados a outro fornecedor</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento em caso de descumprimento da LGPD</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Para exercer qualquer um desses direitos, entre em contato conosco pelos canais abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">8. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Se tiver dúvidas sobre esta política ou quiser exercer seus direitos, fale conosco:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href="https://wa.me/5563992628916"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  +55 63 99262-8916
                </a>
              </li>
              <li>
                <strong>Localização:</strong> Tocantins, Brasil
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">9. Alterações nesta política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta Política de Privacidade pode ser atualizada periodicamente. A data da última
              revisão é sempre indicada no topo desta página. Recomendamos que você a consulte
              regularmente.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
