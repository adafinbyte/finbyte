import { FC } from "react";
import Markdown from "react-markdown";
import Link from "next/link";

import emoji_map from "./emojijs";
import pulse_md_classes from "./classes";

const replace_emojis = (text: string): string => {
  /** @note regular expression to match words wrapped by colons */
  const regex = /:([^:\s]+):/g;
  return text.replace(regex, (match, word) => emoji_map[word] || match);
};

interface custom_props {
  children: string | any;
  example?: boolean;
}

const FinbyteMarkdown: FC <custom_props> = ({ children, example, ...props }) => {
  const replaced_text = replace_emojis(children);
  const pmd_class = pulse_md_classes();

  const is_external_link = (url: string) => {
    try {
      const link = new URL(url);
      return link.hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  };

  const ensure_absolute_url = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://${url}`;
  };

  return (
    <Markdown
      {...props}
      components={{
        img: ({ node, ...props }) => {
          if (props.alt && Object.keys(emoji_map).includes(props.alt)) {
            return <span style={{ display: 'inline-block' }}><img title={`:${props.alt}:`} className='size-3.5' {...props} /></span>;
          } else {
            return <img className={example ? 'max-h-10' : pmd_class.img_class} {...props} />;
          }
        },
        hr: ({ node, ...props })   => <hr className="my-4 border-neutral-700"/>,
        p: ({ node, ...props })    => <p className={pmd_class.p_class} {...props} />,
        a: ({ node, ...props }) => {
          const href = props.href || '';
          const absolute_url = ensure_absolute_url(href);
          const is_external = is_external_link(absolute_url);

          return (
            <Link
              className={pmd_class.a_class}
              href={absolute_url}
              target={is_external ? '_blank' : '_self'}
              rel={is_external ? 'noopener noreferrer' : ''}
            >
              {props.children}
            </Link>
          );
        },
        h1: ({ node, ...props })   => <h1 className={pmd_class.h1_class} {...props} />,
        h2: ({ node, ...props })   => <h2 className={pmd_class.h2_class} {...props} />,
        h3: ({ node, ...props })   => <h3 className={pmd_class.h3_class} {...props} />,
        code: ({ node, ...props }) => <code className={pmd_class.code_class} {...props} />,
      }}
      {...props}
    >
      {replaced_text}
    </Markdown>
  );
};

export default FinbyteMarkdown;