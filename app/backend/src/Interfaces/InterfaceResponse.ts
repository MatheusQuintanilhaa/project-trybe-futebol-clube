import InterfaceMatches from './InterfaceMatches';

export default interface InterfaceResponse {
  type?: number;
  message?: string;
  token?: string;
  createdMatche?: InterfaceMatches;
}
