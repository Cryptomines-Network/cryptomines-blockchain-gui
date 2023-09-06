const ServiceName = {
  WALLET: 'cryptomines_wallet',
  FULL_NODE: 'cryptomines_full_node',
  FARMER: 'cryptomines_farmer',
  HARVESTER: 'cryptomines_harvester',
  SIMULATOR: 'cryptomines_full_node_simulator',
  DAEMON: 'daemon',
  PLOTTER: 'cryptomines_plotter',
  TIMELORD: 'cryptomines_timelord',
  INTRODUCER: 'cryptomines_introducer',
  EVENTS: 'wallet_ui',
  DATALAYER: 'cryptomines_data_layer',
  DATALAYER_SERVER: 'cryptomines_data_layer_http',
} as const;

type ObjectValues<T> = T[keyof T];

export type ServiceNameValue = ObjectValues<typeof ServiceName>;

export default ServiceName;
