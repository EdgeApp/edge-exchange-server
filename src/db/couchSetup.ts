import {
  DatabaseSetup,
  setupDatabase,
  SetupDatabaseOptions
} from 'edge-server-tools'
import { ServerScope } from 'nano'

import { serverConfig } from '../serverConfig'
import { settingsSetup, syncedReplicators } from './couchSettings'

// ---------------------------------------------------------------------------
// Databases
// ---------------------------------------------------------------------------

const exchangeSetup: DatabaseSetup = { name: 'exchange_info' }

// ---------------------------------------------------------------------------
// Setup routine
// ---------------------------------------------------------------------------

export async function setupDatabases(
  connection: ServerScope,
  disableWatching: boolean = false
): Promise<void> {
  const { currentCluster } = serverConfig
  const options: SetupDatabaseOptions = {
    currentCluster,
    replicatorSetup: syncedReplicators,
    disableWatching
  }

  await setupDatabase(connection, settingsSetup, options)
  await Promise.all([setupDatabase(connection, exchangeSetup, options)])
}
