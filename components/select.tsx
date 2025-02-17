import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  ScrollUpButton,
  Viewport,
  Item,
  ItemText,
  ScrollDownButton,
} from '@radix-ui/react-select';
import clsx from 'clsx';
import type { FC } from 'react';
import { useId } from 'react';
import LabelComponent from './label';

type SelectProps = {
  options: {
    label: string;
    value: string;
  }[];
  selected: SelectProps['options'][number]['value'];
  onChangeSelected: (value: string) => void;
  label?: string;
};

const Select: FC<SelectProps> = ({
  label,
  selected,
  onChangeSelected,
  options,
}) => {
  const activeValue = options.find((option) => option.value === selected);
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && <LabelComponent htmlFor={id}>{label}</LabelComponent>}

      <Root value={selected} onValueChange={onChangeSelected}>
        <Trigger
          className={clsx(
            'relative flex w-full cursor-pointer items-center justify-between rounded-md border py-[6px] px-3 text-left shadow-sm focus:outline-none focus:ring-1',
            'border-neutral-300 bg-white focus:border-emerald-500 focus:ring-emerald-500',
            'dark:border-neutral-600 dark:bg-neutral-900 dark:focus:border-emerald-400 dark:focus:ring-emerald-400'
          )}
        >
          <Value className="block truncate">{activeValue?.label}</Value>
          <Icon>
            <ChevronDownIcon
              className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
              aria-hidden="true"
              width={20}
              height={20}
            />
          </Icon>
        </Trigger>

        <Portal>
          <Content
            className={clsx(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
              'bg-white',
              'dark:border dark:border-neutral-600 dark:bg-neutral-900'
            )}
          >
            <ScrollUpButton />
            <Viewport>
              {options.map((option) => (
                <Item
                  value={option.value}
                  key={option.value}
                  className={clsx(
                    option.value === selected
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800',
                    'group relative cursor-pointer select-none py-2 pl-3 pr-9 outline-none transition-colors'
                  )}
                >
                  <ItemText
                    className={clsx(
                      option.value === selected
                        ? 'font-semibold'
                        : 'font-medium',
                      'block truncate'
                    )}
                  >
                    {option.label}
                  </ItemText>
                </Item>
              ))}
            </Viewport>
            <ScrollDownButton />
          </Content>
        </Portal>
      </Root>
    </div>
  );
};

export default Select;
