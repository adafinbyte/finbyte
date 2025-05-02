import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@/components/accordian";
import useThemedProps from "@/contexts/themed-props";
import { FC } from "react"
import { motion } from "framer-motion";

const FinbyteFinbyteConnect: FC = () => {
  const themed = useThemedProps();

  return (
    <div className={`p-2 flex flex-col w-full gap-2`}>

      <p className={`text-xs ${themed['500'].text} px-2 italic`}>
        Please be aware, Finbyte is a work-in-progress so it may have limited supported.
        We do fully intend to fully have everything supported.
        On that note, everything you read here is working one way or another and it will be stated what has been tested using which "thing".
      </p>

      <Accordion>
        <AccordionItem value="0">
          <AccordionHeader>
            Step 1 - Find the Connect button
          </AccordionHeader>
          <AccordionPanel>
            <motion.div
              key={'0'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 1 * 0.1,
              }}
              className="w-full"
            >
              <span>
                <p className={`${themed['400'].text} text-sm`}>
                  At the very top of our platform, we have what is called a navigation bar.
                  On this, you will see a connect button. Click it.
                </p>

                <img src='/finbyte/connect-wallet/step-1.png' className="max-w-80"/>
              </span>
            </motion.div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="1">
          <AccordionHeader>
            Step 2 - Choose your wallet
          </AccordionHeader>
          <AccordionPanel>
            <motion.div
              key={'1'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 1 * 0.1,
              }}
              className="w-full"
            >
            <span>
              <p className={`${themed['400'].text} text-sm`}>
                Now you should see a modal popup within the platform.
                On this, if you have any Cardano wallets that are currently installed on your browser, you should be looking at the list of currently installed wallets.
                For us, we're using Eternl!
              </p>

              <img src='/finbyte/connect-wallet/step-2.png' className="max-w-80"/>
            </span>
            </motion.div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionHeader>
            Step 3 - Sign & Confirm
          </AccordionHeader>
          <AccordionPanel>
            <motion.div
              key={'2'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 1 * 0.1,
              }}
              className="w-full"
            >
            <span>
              <p className={`${themed['400'].text} text-sm`}>
                Once you have clicked your chosen wallet, you should get a request to sign the data required to establish a connection with Finbyte.
                Type in your password/passcode to confirm your connection.
              </p>
            </span>
            </motion.div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <div className={`flex flex-col text-[10px]`} style={{ placeItems: 'end'}}>
        <span className={`rounded-lg border ${themed['700'].border} flex flex-col`}>
          <div className={`flex justify-end italic border-b ${themed['700'].border} ${themed['400'].text} p-1`}>
            Tested Using
          </div>

          <div className={`inline-flex p-1 ${themed[300].text}`}>
            Brave Browser w/Eternl wallet
          </div>
        </span>
      </div>
    </div>
  )
}

export default FinbyteFinbyteConnect;