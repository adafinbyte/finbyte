"use client"

import { Check, ChevronRight, Eraser, Glasses, Pencil, Plus, Send, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { create_forum_post_data } from "@/utils/api/interfaces"
import { useWallet } from "@meshsdk/react"
import { moderation_addresses } from "@/utils/consts"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import FinbyteMarkdown from "../../finbytemd"
import { capitalize_first_letter } from "@/utils/string-tools"
import RequestTypeComboBox from "./request-type-combobox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FC, useEffect, useState } from "react"

const steps = [
  {
    id: "topic",
    name: "Topic",
    icon: <Pencil className="h-4 w-4" />,
    fields: ["title", "category"],
  },
  {
    id: "content",
    name: "Content",
    icon: <Tag className="h-4 w-4" />,
    fields: ["content", "tags"],
  },
  {
    id: "review",
    name: "Review",
    icon: <Send className="h-4 w-4" />,
    fields: [],
  },
]

interface custom_props {
  on_submit: (details: create_forum_post_data) => Promise<void>;
}

const CreatePostModal: FC <custom_props> = ({
  on_submit
}) => {
  const { toast } = useToast();
  const { address, connected } = useWallet();

  const [post_section, set_post_section] = useState<string>('general');

  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const [preview_post, set_preview_post] = useState(false);
  const [post_query, set_post_query] = useState<string>('');
  const [title_query, set_title_query] = useState<string>('');
  const [post_request_type, set_post_request_type] = useState<string | null>(null);
  const [post_tag_query, set_post_tag_query] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (valid.post === false || valid.title === false) {
      toast({
        description: 'Post is invalid.',
        variant: 'destructive'
      });
      return;
    }

    if (!connected) {
      toast({
        description: 'No wallet found.',
        variant: 'destructive'
      });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    await on_submit({
      timestamp: timestamp,
      author: address,
      tag: post_tag_query ? post_tag_query : null,
      post: post_query,
      title: title_query,
      section: post_section,
      has_poll: false,
    })

    setOpen(false);
    setCurrentStep(0);
  }

  const boundries = { title: [12, 50], post: [50, 1500], tag: [4, 20] }
  const valid = {
    title: (title_query.length < boundries.title[0] || title_query.length > boundries.title[1]) ? false : true,
    post: (post_query.length < boundries.post[0] || post_query.length > boundries.post[1]) ? false : true,
    tag: (post_tag_query.length < boundries.tag[0] || post_tag_query.length > boundries.tag[1]) ? false : true,
  }
  const [valid_state, set_valid_state] = useState(valid);

  useEffect(() => {
    set_valid_state(valid)
  }, [title_query, post_query, post_tag_query]);

  const disabled_next_step =
    currentStep === 0 ?
      valid_state.title === false :
    currentStep === 1 ?
      post_section === 'general' ?
        valid_state.post === false :
      post_section === 'requests' ?
        (valid_state.post === false || valid_state.tag === false || valid_state.title === false) :
      false :
    false;

    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!connected}>
          <Plus />
          New Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Forum Post Creation</DialogTitle>
          <DialogDescription>Share your thoughts, questions, or ideas with the community.</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="my-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      currentStep > index
                        ? "border-transparent text-green-400"
                        : currentStep === index
                          ? "border-blue-400 text-blue-400"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}
                  >
                    {currentStep > index ? <Check className="h-4 w-4" /> : step.icon}
                  </div>
                  <span
                    className={`mt-1 text-xs ${currentStep >= index ? "text-foreground" : "text-muted-foreground/50"}`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-[2px] w-full max-w-[60px] ${
                      currentStep > index ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {[0,1,2].includes(currentStep) && (
          <div key={currentStep} className="transition-opacity duration-150">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Topic */}
              {currentStep === 0 && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                      value={title_query}
                      onChange={(e) => set_title_query(e.target.value)}
                      placeholder="Enter a descriptive title"
                      required
                      className={cn(
                      title_query.length > 0 ? valid_state.title
                        ? 'dark:border-green-400' : 'dark:border-destructive'
                        : ''
                      )}
                    />
                    {!valid_state.title && title_query.length > 0 && <p className="text-sm text-red-500 mt-1">{title_query.length < boundries.title[0] ? 'Title too small.' : 'Title too big.'}</p>}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label>Section</Label>
                      <Label className="text-xs">Posting to: #<span className="dark:text-blue-400 text-blue-500">{capitalize_first_letter(post_section)}</span></Label>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Button size={'sm'} type="button" onClick={() => set_post_section('general')} disabled={post_section === 'general'} variant='outline'>
                          General
                        </Button>

                        <Button size={'sm'} type="button" onClick={() => set_post_section('requests')} disabled={post_section === 'requests'} variant='outline'>
                          Requests
                        </Button>

                        {moderation_addresses.includes(address.toString()) && (
                          <div className="flex items-center space-x-2">
                            <Button size={'sm'} type="button" onClick={() => set_post_section('finbyte')} disabled={post_section === 'finbyte'} variant='outline'>
                              Finbyte
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Content */}
              {currentStep === 1 && (
                <div className="grid gap-4 py-4">
                  {post_section === 'requests' && (
                    <div className="grid grid-cols-2 gap-x-4" style={{ placeItems: 'start' }}>
                      <div className="flex flex-col gap-2 w-full">
                        <Label>Request Type</Label>
                        <RequestTypeComboBox on_selected={set_post_request_type}/>
                      </div>
                      {post_request_type && (
                        <div className="flex flex-col gap-2 w-full">
                          <Label>
                            {post_request_type === 'token' && 'Token Ticker'}
                            {post_request_type === 'feature' && 'Feature Name'}
                          </Label>

                          <Input
                            value={post_tag_query}
                            onChange={(e) => set_post_tag_query(e.target.value)}
                            className={cn(
                              "w-full",
                              post_tag_query.length > 0 ?
                                valid_state.tag
                                ? "border-green-400" : "border-destructive" : "",
                            )}
                          />
                          {!valid_state.tag && post_tag_query.length > 0 && <p className="text-sm text-red-500 mt-1">{post_tag_query.length < boundries.tag[0] ? 'Tag too small.' : 'Post too big.'}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="post">Post Content</Label>
                    {preview_post ?
                      <span className="min-h-12">
                        <FinbyteMarkdown>
                          {post_query}
                          </FinbyteMarkdown>
                        </span>
                      : (
                        <Textarea
                          value={post_query}
                          onChange={(e) => set_post_query(e.target.value)}
                          placeholder="Write your post content here..."
                          required
                          className={cn(
                            post_query.length > 0
                            ? valid_state.post ?
                            'border-green-400' : 'border-destructive' : '',
                            "min-h-[150px] max-h-64"
                          )}
                        />
                      )
                    }
                    {!valid_state.post && post_query.length > 0 && <p className="text-sm text-red-500 mt-1">{post_query.length < boundries.post[0] ? 'Post too small.' : 'Post too big.'}</p>}

                    <div className="flex w-full gap-2 items-center">
                      <Button type="button" onClick={() => set_post_query('')} className="size-8 p-1" variant='outline' size='sm'>
                        <Eraser/>
                      </Button>
                      <Button type="button" onClick={() => set_preview_post(!preview_post)} className="size-8 p-1" variant='outline' size='sm'>
                        <Glasses/>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="grid gap-4 py-4">
              <div className="rounded-md border dark:border-neutral-800 p-4">
                <ScrollArea className="w-full max-h-64 overflow-auto pr-2">
                  <div>
                    <h3 className="font-medium">{title_query}</h3>
                    <div className="mt-1 flex items-center gap-2 pb-4">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {post_section}
                      </span>
                      {post_request_type && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {post_request_type}
                        </span>
                      )}
                      {post_tag_query && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {post_tag_query}
                        </span>
                      )}
                    </div>
                    <span className="text-sm">
                      <FinbyteMarkdown>
                        {post_query}
                      </FinbyteMarkdown>
                    </span>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between">
            <div>
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={disabled_next_step}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="gap-1">
                  Submit Post
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostModal;
