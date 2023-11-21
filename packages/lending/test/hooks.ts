import { LendingProtocol as AaveV3Lending } from 'src/protocols/aave-v3/lending-protocol';
import { Adapter } from 'src/adapter';
import { LendingProtocol as CompoundV3Lending } from 'src/protocols/compound-v3/lending-protocol';
import { LendingSwaper } from 'src/protocols/paraswap-v5/lending-swaper';

export async function setup() {
  Adapter.registerProtocol(AaveV3Lending);
  Adapter.registerProtocol(CompoundV3Lending);
  Adapter.registerSwaper(LendingSwaper);
}
