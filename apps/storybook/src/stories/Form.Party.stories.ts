import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'

const meta = {
  title: 'Form/Party',
  component: Form.Party,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    value: [
      {
        id: 1,
        url: 'http://nng-phinf.pstatic.net/MjAyNTA2MDlfMTAg/MDAxNzQ5NDM3NTk2MzQx.FFrvPmLdvAqg-OHMmFnv7DHK0P04Wisu6ldjzy5tsO8g.m6if16OQTEfW6p03AqgK4wrA6piufA06HxWlSribKt4g.PNG/%EC%95%A8%EB%A6%AC%EC%8A%A42.png',
      },
    ],
  },
} satisfies Meta<typeof Form.Party>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    value: [
      {
        id: 156728,
        color: '#debe8d',
        url: 'http://nng-phinf.pstatic.net/MjAyNTA2MDlfMTAg/MDAxNzQ5NDM3NTk2MzQx.FFrvPmLdvAqg-OHMmFnv7DHK0P04Wisu6ldjzy5tsO8g.m6if16OQTEfW6p03AqgK4wrA6piufA06HxWlSribKt4g.PNG/%EC%95%A8%EB%A6%AC%EC%8A%A42.png',
      },
      {
        id: 156729,
        color: '#b92734',
        url: 'https://nng-phinf.pstatic.net/MjAyNTA2MDlfMTM1/MDAxNzQ5NDM3NTI0NzA2.5HsWQBww-6si-Hmmv6ehuiNx2GCztSkx269ogbzB684g.R7WVsIVBOnLkFqAt3ZUBkpLgDbUhn2_Xh5M3pzri_h0g.PNG/%EC%9C%A0%EC%A6%88%ED%95%982.png',
      },
      {
        id: 154605,
        color: '#C77DFB',
        url: 'https://nng-phinf.pstatic.net/MjAyNTAzMDZfMjA5/MDAxNzQxMjQ5MTA2NTEz.Nm9-2_g60WEqVNm9cAquZt39joHq1-2V_RpwqYWBoFMg.vg8SPkKO8vsDNJ14cW1v6HFlTL4LkGKibTMTLWI49owg.PNG/DB1.png',
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    size: 'md',
    value: [null, null, null],
  },
}
