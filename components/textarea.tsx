import clsx from 'clsx';
import type { ChangeEventHandler, FC, HTMLProps } from 'react';
import { useId } from 'react';
import Hint from './hint';
import Label from './label';

type TextAreaProps = HTMLProps<HTMLTextAreaElement> & {
  onValueChange?: (value: string) => void;
  hint?: string;
  label?: string;
};

const TextArea: FC<TextAreaProps> = ({
  onValueChange,
  hint,
  label,
  ...props
}) => {
  const labelId = useId();
  const hintId = useId();

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    props.onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={labelId}>{label}</Label>}
      <textarea
        id={labelId}
        className={clsx(
          'block max-h-[25rem] min-h-[8rem] w-full rounded-md shadow-sm',
          'border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500',
          'dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400'
        )}
        aria-describedby={hintId}
        {...props}
        onChange={handleChange}
      />
      {hint && <Hint id={hintId}>{hint}</Hint>}
    </div>
  );
};

export default TextArea;
