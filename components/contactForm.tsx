'use client';
import type { FC, FormEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from './button';
import Select from './select';
import Modal from './modal';
import Textarea from '@/components/textarea';
import parseError from '@/lib/parseError';
import Input from '@/components/input';

const emailRegex = /^\S+@\S+\.\S+$/u;
const budgetOptions = [
  { label: '< $10K', value: 'low' },
  { label: '$10K - $25K', value: 'medium' },
  { label: '$25K - $50K', value: 'high' },
  { label: '> $50K', value: 'super-high' },
];

const ContactForm: FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [type, setType] = useState<string>('contact');
  const [budget, setBudget] = useState<(typeof budgetOptions)[number]['value']>(
    budgetOptions[1].value
  );
  const firstInput = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    setSending(true);

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_API_PASSPHRASE ?? ''
          }`,
        },
        body: JSON.stringify({
          name,
          email,
          message,
          type,
          ...(type === 'freelance' && {
            budget: budgetOptions.find((option) => option.value === budget)
              ?.label,
          }),
        }),
      });

      const data = (await response.json()) as { message: string };

      if (!response.ok) {
        throw new Error(data.message);
      }

      setName('');
      setEmail('');
      setMessage('');

      toast.success(data.message);
    } catch (error) {
      const errorMessage = parseError(error);

      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="font-medium text-neutral-900 underline dark:text-white"
    >
      get in touch
    </button>
  );

  const handleMessageChange = (newValue: string) => {
    const parsedMessage = newValue.replaceAll('\r', '').replaceAll('\n', '');

    setMessage(parsedMessage);
  };

  return (
    <Modal trigger={trigger} open={open} setOpen={setOpen}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-sm flex-col gap-4 rounded-sm bg-white p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Let&apos;s talk
        </h2>
        <Select
          label="I would like to..."
          options={[
            { label: 'Have a chat', value: 'contact' },
            { label: 'Hire you for freelance work', value: 'freelance' },
            {
              label: 'Hire you for consulting work',
              value: 'consulting',
            },
            {
              label: 'Ask you to join our board',
              value: 'board',
            },
          ]}
          selected={type}
          onChangeSelected={setType}
        />
        <Input
          label="Name"
          ref={firstInput}
          placeholder="Jane Smith"
          required
          type="text"
          id="name"
          autoFocus
          value={name}
          onValueChange={setName}
        />
        <Input
          label="Email"
          placeholder="jane@acme.com"
          required
          type="email"
          id="email"
          value={email}
          onValueChange={setEmail}
        />
        <Textarea
          label="Message"
          placeholder={
            type === 'freelance'
              ? 'Tell me about your project'
              : "What's on your mind?"
          }
          required
          id="message"
          value={message}
          onValueChange={handleMessageChange}
        />
        {type === 'freelance' && (
          <Select
            label="Budget"
            options={budgetOptions}
            selected={budget}
            onChangeSelected={setBudget}
          />
        )}
        <Button
          type="submit"
          disabled={
            !name.trim() ||
            !email.trim() ||
            !message.trim() ||
            sending ||
            !emailRegex.exec(email)
          }
          loading={sending}
        >
          Send
        </Button>
      </form>
    </Modal>
  );
};

export default ContactForm;
