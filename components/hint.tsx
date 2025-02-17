import clsx from 'clsx';
import type { FC, HTMLProps } from 'react';

type HintProps = HTMLProps<HTMLParagraphElement>;

const Hint: FC<HintProps> = (props) => (
  <p
    className={clsx(
      'mt-2 text-sm',
      'text-neutral-500',
      'dark:text-neutral-400'
    )}
    {...props}
  />
);

export default Hint;
