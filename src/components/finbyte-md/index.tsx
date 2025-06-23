import { Children, FC } from "react";
import Markdown from "react-markdown";
import Link from "next/link";
import emoji_map from "./emojijs";
import pulse_md_classes from "./classes";
import FormatAddress from "../format-address";

const replace_emojis = (text: string): string => {
  const regex = /:([^:\s]+):/g;
  return text.replace(regex, (match, word) => emoji_map[word] || match);
};

interface custom_props {
  children: string | any;
}

const FinbyteMarkdown: FC<custom_props> = ({
  children,
  ...props
}) => {
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
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `http://${url}`;
  };

  const TOKEN_REGEX = /\$[a-zA-Z0-9-_]+/g;

  return (
    <Markdown
      {...props}
      components={{
        img: ({ node, ...props }) => {
          if (props.alt && Object.keys(emoji_map).includes(props.alt)) {
            return (
              <span style={{ display: "inline-block" }}>
                <img title={`:${props.alt}:`} className="size-3.5" {...props} />
              </span>
            );
          } else {
            return <img className={pmd_class.img_class} {...props} />;
          }
        },
        hr: ({ node, ...props }) => (
          <hr className="my-4 border-slate-700" {...props} />
        ),
        p: ({ node, children }) => {
          const tokenRegex = /\$[a-zA-Z0-9-_]+/g;

          const processChild = (child: any) => {
            if (typeof child === "string") {
              const parts = [];
              let lastIndex = 0;
              const matches = [...child.matchAll(tokenRegex)];

              for (const match of matches) {
                const start = match.index!;
                const end = start + match[0].length;

                if (lastIndex < start) {
                  parts.push(child.slice(lastIndex, start));
                }

                const token = match[0];
                parts.push(
                  <Link href={`/dashboard?address=${token}`} className="py-0.5 px-2 rounded-lg bg-secondary">
                    <FormatAddress key={start} address={token} />
                  </Link>
                );

                lastIndex = end;
              }

              if (lastIndex < child.length) {
                parts.push(child.slice(lastIndex));
              }

              return parts;
            }

            return child; // Leave non-string children unchanged (e.g., links)
          };

          const processedChildren = Children.toArray(children).flatMap(processChild);

          return (
            <p
              className={pmd_class.p_class}
            >
              {processedChildren}
            </p>
          );
        },
        a: ({ node, ...props }) => {
          const href = props.href || "";
          const absolute_url = ensure_absolute_url(href);
          const is_external = is_external_link(absolute_url);

          return (
            <Link
              className={pmd_class.a_class}
              href={absolute_url}
              target={is_external ? "_blank" : "_self"}
              rel={is_external ? "noopener noreferrer" : ""}
            >
              {props.children}
            </Link>
          );
        },
        h1: ({ node, ...props }) => <h1 className={pmd_class.h1_class} {...props} />,
        h2: ({ node, ...props }) => <h2 className={pmd_class.h2_class} {...props} />,
        h3: ({ node, ...props }) => <h3 className={pmd_class.h3_class} {...props} />,
        code: ({ node, ...props }) => (
          <code className={pmd_class.code_class} {...props} />
        ),
        br: ({ node, ...props }) => <code className={"my-2"} {...props} />,
      }}
    >
      {replaced_text}
    </Markdown>
  );
};

export default FinbyteMarkdown;
