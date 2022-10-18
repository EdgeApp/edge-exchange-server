import { Network } from '@xchainjs/xchain-client'
import {
  CryptoAmount,
  EstimateSwapParams,
  Midgard,
  ThorchainCache,
  ThorchainQuery,
  Thornode,
  TxDetails
} from '@xchainjs/xchain-thorchain-query'
import {
  assetAmount,
  assetFromString,
  assetToBase
} from '@xchainjs/xchain-util'
import { div, mul, sub, toFixed } from 'biggystring'
import { Serverlet } from 'serverlet'

import {
  asGetQuoteBody,
  ExchangePluginIds,
  GetQuoteBody,
  GetQuoteFunction,
  GetQuoteResponseThorchain
} from '../../types/quoteTypes'
import { DbRequest } from '../../types/requestTypes'
import { jsonResponse } from '../../types/responseTypes'

/**
 * POST /v2/device
 */
export const quoteRoute: Serverlet<DbRequest> = async request => {
  const quoteBody = asGetQuoteBody(request.req.body)

  console.log(JSON.stringify(quoteBody, null, 2))

  const handler = exchangePluginIdMap[quoteBody.exchangePluginId]
  const response = await handler(quoteBody)
  if ('error' in response) {
    return jsonResponse({ error: response.error }, { status: response.status })
  } else {
    return jsonResponse(response)
  }
}

const THOR_LIMIT_UNITS = '100000000'
const VOLATILITY_PERCENT = '0.5'

const thorchainCache = new ThorchainCache(
  new Midgard(Network.Mainnet),
  new Thornode(Network.Mainnet)
)
const thorchainQuery = new ThorchainQuery(thorchainCache)

const getThorchainQuote: GetQuoteFunction = async (quoteBody: GetQuoteBody) => {
  const {
    exchangeAmount,
    fromCurrencyPluginId,
    fromCurrencyCode,
    toCurrencyCode,
    toCurrencyPluginId,
    toAddress,
    referralId,
    referralFeePercent
  } = quoteBody
  const fromChain = chainPluginIdToCurrency[fromCurrencyPluginId]
  const toChain = chainPluginIdToCurrency[toCurrencyPluginId]

  const fromAsset = assetFromString(`${fromChain}.${fromCurrencyCode}`)
  const toAsset = assetFromString(`${toChain}.${toCurrencyCode}`)

  if (fromAsset == null) {
    return {
      error: 'Invalid from asset selection',
      status: 404
    }
  }
  if (toAsset == null) {
    return {
      error: 'Invalid to asset selection',
      status: 404
    }
  }

  const affiliateFeePercent =
    referralFeePercent != null ? referralFeePercent / 10000 : undefined
  const swapParams: EstimateSwapParams = {
    input: new CryptoAmount(
      assetToBase(assetAmount(Number(exchangeAmount))),
      fromAsset
    ),
    affiliateAddress: referralId,
    affiliateFeePercent,
    destinationAsset: toAsset,
    destinationAddress: toAddress
  }
  const estimate: TxDetails = await thorchainQuery.estimateSwap(swapParams)
  console.log(
    'affiliateFee',
    estimate.txEstimate.totalFees.affiliateFee.formatedAssetString()
  )
  console.log(
    'inboundFee',
    estimate.txEstimate.totalFees.inboundFee.formatedAssetString()
  )
  console.log(
    'outboundFee',
    estimate.txEstimate.totalFees.outboundFee.formatedAssetString()
  )
  console.log(
    'swapFee',
    estimate.txEstimate.totalFees.swapFee.formatedAssetString()
  )
  console.log('netOutput', estimate.txEstimate.netOutput.formatedAssetString())
  const memoSplit = estimate.memo.split(':')
  const limit = memoSplit[3]
  const toExchangeAmount = div(limit, THOR_LIMIT_UNITS, 18)

  // Apply volatility %
  const volPercent = div(sub('100', VOLATILITY_PERCENT), '100', 6)
  const limitVol = mul(volPercent, limit)
  memoSplit[3] = toFixed(limitVol, 0, 0)
  const memo = memoSplit.join(':')

  const out: GetQuoteResponseThorchain = {
    toExchangeAmount,
    expiryDate: estimate.expiry.toISOString(),
    depositAddress: estimate.toAddress,
    memo
  }
  return out
}

const exchangePluginIdMap: { [pluginId: ExchangePluginIds]: GetQuoteFunction } =
  {
    thorchain: getThorchainQuote
  }

const chainPluginIdToCurrency: { [pluginId: string]: string } = {
  avalanche: 'AVAX',
  bitcoin: 'BTC',
  bitcoincash: 'BCH',
  dogecoin: 'DOGE',
  ethereum: 'ETH',
  litecoin: 'LTC'
}
