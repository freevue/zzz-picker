import type { Meta, StoryObj } from '@storybook/react-vite'
import { Agent } from '@zzz-picker/components/v2'

const meta = {
  title: 'Agent/Profile',
  component: Agent.Profile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    url: { control: 'text' },
    color: { control: 'color' },
    className: { control: 'text' },
    flat: { control: 'boolean' },
    alt: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    url: 'http://nng-phinf.pstatic.net/MjAyNTA2MDlfMTAg/MDAxNzQ5NDM3NTk2MzQx.FFrvPmLdvAqg-OHMmFnv7DHK0P04Wisu6ldjzy5tsO8g.m6if16OQTEfW6p03AqgK4wrA6piufA06HxWlSribKt4g.PNG/%EC%95%A8%EB%A6%AC%EC%8A%A42.png',
  },
} satisfies Meta<typeof Agent.Profile>

export default meta

type Story = StoryObj<typeof meta>

export const Profile: Story = {
  args: {
    url: 'http://nng-phinf.pstatic.net/MjAyNTA2MDlfMTAg/MDAxNzQ5NDM3NTk2MzQx.FFrvPmLdvAqg-OHMmFnv7DHK0P04Wisu6ldjzy5tsO8g.m6if16OQTEfW6p03AqgK4wrA6piufA06HxWlSribKt4g.PNG/%EC%95%A8%EB%A6%AC%EC%8A%A42.png',
    size: 'md',
    color: '#debe8d',
    flat: false,
    alt: '',
  },
}

export const Empty: Story = {
  args: {
    url: undefined,
  },
}
