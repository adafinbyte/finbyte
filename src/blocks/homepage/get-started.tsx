import { FC } from "react";

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@/components/accordian";

const HomepageGetStarted: FC = () => {
  interface faq_item {title: string; text: string; extra_text?: string}
  const faq_items: faq_item[] = [
    {
      title: 'What is Cardano?',
      text: `Cardano is a proof-of-stake blockchain platform: the first to be founded on peer-reviewed research and developed through evidence-based methods. It combines pioneering technologies to provide unparalleled security and sustainability to decentralized applications, systems, and societies.
        With a leading team of engineers, Cardano exists to redistribute power from unaccountable structures to the margins - to individuals - and be an enabling force for positive change and progress.`,
      extra_text: 'Directly quoting https://cardano.org/',
    },
    {
      title: 'What is Finbyte?',
      text: `Finbyte offers a secure platform for tokenized projects on the Cardano blockchain, allowing everyday users to contribute to project curation. Additionally, it provides a robust, free-to-use forum powered by Cardano's CIP-8 technology, ensuring verified actions.`,
      extra_text: '',
    },
    {
      title: 'How to Login to Finbyte?',
      text: `To log in to Finbyte, there's just one main requirement: you need to be using a web browser that supports installing extensions—like most desktop browsers (Chrome, Brave, Firefox, etc.). In addition, you'll need a Cardano-compatible browser wallet (also known as a light wallet) that can connect to DApps. Once everything is set up, simply head over to Finbyte and click the Connect button. It's really that easy.`,
      extra_text: '',
    },
    {
      title: 'How is it free?',
      text: `Finbyte is completely free to use because we believe in building open, accessible tools for the Cardano community. While there are behind-the-scenes costs to keep the platform running, we cover those so that you don't have to. Instead of relying on traditional logins or subscriptions, we use Cardano's CIP-8 standard to verify actions on the platform. This means your wallet signs any important activity (like creating a post, liking something, or tipping) helping us ensure authenticity without needing passwords, emails, or invasive tracking. Our goal is to provide a seamless, secure experience powered entirely by your wallet connection. You get full functionality with zero fees or hidden charges.`,
      extra_text: '',
    },
  ];

  return (
    <div className="flex flex-col w-full lg:w-[75%] lg:mx-auto text-sm">
      <h1 className="text-center font-semibold text-base mb-2">
        Getting Started
      </h1>

      <Accordion defaultValue={'0'}>
        {faq_items.map((item, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionHeader>
              {item.title}
            </AccordionHeader>
            <AccordionPanel>
              <div className="flex flex-col gap-2">
                {item.text}

                {item.extra_text && (
                  <span className="mt-2 text-xs">
                    {item.extra_text}
                  </span>
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default HomepageGetStarted;