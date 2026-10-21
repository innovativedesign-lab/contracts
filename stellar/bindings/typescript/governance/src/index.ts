import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

/**
 * Governance configuration.
 */
export interface GovernanceConfig {
  token: Buffer;
  quorum: i128;
  voting_period: u32;
  timelock: u32;
}

/**
 * Proposal state.
 */
export type ProposalState = 
  | {tag: "Active", values: void}
  | {tag: "Succeeded", values: void}
  | {tag: "Defeated", values: void}
  | {tag: "Executed", values: void}
  | {tag: "Canceled", values: void};

/**
 * A governance proposal.
 */
export interface Proposal {
  id: u32;
  proposer: Buffer;
  target: Buffer;
  function: string;
  args: Buffer;
  description: string;
  for_votes: i128;
  against_votes: i128;
  start_ledger: u32;
  end_ledger: u32;
  state: ProposalState;
}

/**
 * Vote record.
 */
export interface Vote {
  voter: Buffer;
  support: boolean;
  weight: i128;
}

/**
 * Governance errors.
 */
export type GovernanceError =
  | {tag: "AlreadyInitialized", values: void}
  | {tag: "NotInitialized", values: void}
  | {tag: "ProposalNotFound", values: void}
  | {tag: "ProposalNotActive", values: void}
  | {tag: "AlreadyVoted", values: void}
  | {tag: "ProposalNotSucceeded", values: void}
  | {tag: "TimelockNotExpired", values: void}
  | {tag: "Unauthorized", values: void};

export class Client extends ContractClient {
  public spec: ContractSpec;
  public options: ContractClientOptions;

  constructor(options: ContractClientOptions) {
    super(options);
    this.options = options;
    this.spec = new ContractSpec({
      ...this.options,
      contractId: this.options.contractId,
    });
  }

  /**
   * Initialize the governance contract.
   */
  public async init(args: {
    admin: Buffer;
    token: Buffer;
    quorum: i128;
    voting_period: u32;
    timelock: u32;
  }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("init", args, options);
  }

  /**
   * Get the current governance configuration.
   */
  public async get_config(options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("get_config", {}, options);
  }

  /**
   * Create a new governance proposal.
   */
  public async propose(args: {
    proposer: Buffer;
    target: Buffer;
    function: string;
    args: Buffer;
    description: string;
  }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("propose", args, options);
  }

  /**
   * Get a proposal by ID.
   */
  public async get_proposal(args: { proposal_id: u32 }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("get_proposal", args, options);
  }

  /**
   * Cast a vote on an active proposal.
   */
  public async vote(args: {
    voter: Buffer;
    proposal_id: u32;
    support: boolean;
  }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("vote", args, options);
  }

  /**
   * Get the vote record for a voter on a proposal.
   */
  public async get_vote(args: {
    proposal_id: u32;
    voter: Buffer;
  }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("get_vote", args, options);
  }

  /**
   * Execute a proposal that has passed.
   */
  public async execute(args: { proposal_id: u32 }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("execute", args, options);
  }

  /**
   * Cancel a proposal.
   */
  public async cancel(args: { proposal_id: u32 }, options?: MethodOptions): Promise<AssembledTransaction<GovernanceError>> {
    return this.call("cancel", args, options);
  }
}
