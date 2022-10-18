import {
  asEither,
  asNumber,
  asObject,
  asOptional,
  asString,
  asValue
} from 'cleaners'

export const asExchangePluginIds = asEither(asValue('thorchain'))

export const asGetQuoteBody = asObject({
  exchangePluginId: asExchangePluginIds,
  fromCurrencyPluginId: asString,
  fromCurrencyCode: asString,
  toCurrencyPluginId: asString,
  toCurrencyCode: asString,
  toAddress: asString,
  exchangeAmount: asString,
  quoteDirection: asEither(asValue('from'), asValue('to')),
  referralId: asOptional(asString),
  referralFeePercent: asOptional(asNumber)
})

export type GetQuoteBody = ReturnType<typeof asGetQuoteBody>
export type ExchangePluginIds = ReturnType<typeof asExchangePluginIds>

export interface GetQuoteError {
  error: string
  status: number
}

export interface GetQuoteResponseCommon {
  depositAddress: string
  expiryDate: string
  toExchangeAmount?: string
  fromExchangeAmount?: string
}

export interface GetQuoteResponseThorchain extends GetQuoteResponseCommon {
  memo: string
}

export type GetQuoteResponse = GetQuoteResponseThorchain

export type GetQuoteFunction = (
  param: GetQuoteBody
) => Promise<GetQuoteResponse | GetQuoteError>
