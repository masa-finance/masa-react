import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MasaProvider } from '../../../../provider';
import { ModalComponent } from '../../../modal';
import InterfaceMasaGreen from '.';
import { AirdropPage } from './airdrop';
import { NotBotPage } from './not-a-bot';
import { PhoneInputInterface } from './phone-input';
import { CodeInterface } from './code';
import { VerifyAndMintInterface } from './verifiy-and-mint';
import { Success } from './success';

const meta: Meta = {
  title: 'Masa Green',
  component: InterfaceMasaGreen,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="masa-modal story">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type Story = StoryObj<typeof InterfaceMasaGreen>;

const pagesParams = {
  next: () => console.log('next'),
  back: () => console.log('back'),
  complete: () => console.log('complete'),
  setIndex: () => console.log('setIndex'),
  context: {
    phoneNumber: '+1 234 567 890',
  },
};

export const Primary: Story = {
  render: (props: any) => (
    <MasaProvider company="Masa" forceNetwork="goerli">
      <ModalComponent open={props.open} close={() => {}} setOpen={() => {}}>
        <InterfaceMasaGreen />
      </ModalComponent>
    </MasaProvider>
  ),
  args: {
    open: false,
  },
};

export const Airdrop: Story = {
  render: () => <AirdropPage {...pagesParams} />,
};

export const AntiBotDisclaimer: Story = {
  render: () => <NotBotPage {...pagesParams} />,
};

export const PhoneInput: Story = {
  render: () => <PhoneInputInterface {...pagesParams} />,
};

export const CodeInput: Story = {
  render: () => <CodeInterface {...pagesParams} />,
};

export const VerifyAndMint: Story = {
  render: () => <VerifyAndMintInterface {...pagesParams} />,
};

export const SuccessModal: Story = {
  render: () => <Success {...pagesParams} />,
};
