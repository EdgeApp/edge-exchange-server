import {
  asArray,
  asBoolean,
  asMaybe,
  asNumber,
  asObject,
  asString
} from 'cleaners'
import {
  asReplicatorSetupDocument,
  DatabaseSetup,
  syncedDocument
} from 'edge-server-tools'

/**
 * Live-updating server options stored in the `push-settings` database.
 */
const asSettings = asObject({
  apiKeys: asMaybe(
    asArray(
      asObject({
        name: asString,
        apiKey: asString
      })
    ),
    []
  ),

  // Mode toggles:
  debugLogs: asMaybe(asBoolean, false),
  daemonMaxHours: asMaybe(asNumber, 1),

  // Other services we rely on:
  infuraProjectId: asMaybe(asString, ''),
  slackUri: asMaybe(asString, '')
})

export const syncedReplicators = syncedDocument(
  'replicators',
  asReplicatorSetupDocument
)

export const syncedSettings = syncedDocument('settings', asSettings.withRest)

export const settingsSetup: DatabaseSetup = {
  name: 'exchange_settings',
  syncedDocuments: [syncedReplicators, syncedSettings]
}
