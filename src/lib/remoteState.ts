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

let remoteStateRequest: Promise<LoadedRemoteState> | null = null;
let propertiesRequest: Promise<Property[]> | null = null;

export function loadRemoteState(): Promise<LoadedRemoteState> {
  remoteStateRequest ??= (async () => {
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
  })();
  return remoteStateRequest;
}

export function loadRemoteProperties(): Promise<Property[]> {
  propertiesRequest ??= (async () => {
    const response = await fetch('/api/data/properties', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Data service returned ${response.status}`);
    const payload = (await response.json()) as { properties?: Property[] };
    if (!Array.isArray(payload.properties)) throw new Error('Property response is invalid');
    return payload.properties;
  })();
  return propertiesRequest;
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
