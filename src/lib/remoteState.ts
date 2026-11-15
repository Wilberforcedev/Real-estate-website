import type { AgentInquiry, Property, SavedSearch, TourBooking } from '../types';

export interface RemoteState {
  savedPropertyIds: string[];
  savedSearches: SavedSearch[];
  tourBookings: TourBooking[];
  agentInquiries: AgentInquiry[];
  customProperties: Property[];
}

export interface LoadedRemoteState {
  state: RemoteState;
  isNewSession: boolean;
}

const EMPTY_STATE: RemoteState = {
  savedPropertyIds: [],
  savedSearches: [],
  tourBookings: [],
  agentInquiries: [],
  customProperties: [],
};

export async function loadRemoteState(): Promise<LoadedRemoteState> {
  const response = await fetch('/api/data/state', {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Data service returned ${response.status}`);
  const payload = (await response.json()) as Partial<LoadedRemoteState>;
  return {
    state: { ...EMPTY_STATE, ...(payload.state as Partial<RemoteState>) },
    isNewSession: Boolean(payload.isNewSession),
  };
}

export async function saveRemoteState(state: RemoteState): Promise<void> {
  const response = await fetch('/api/data/state', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new Error(`Data service returned ${response.status}`);
}
