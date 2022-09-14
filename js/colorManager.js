import * as d3 from 'd3';

// https://d3-graph-gallery.com/graph/custom_color.html
const colorMap = [
    { key: 'Russia', value: '#fb8072', }, // Red
    { key: 'Ukraine', value: '#80b1d3', }, // Blue
    
    { key: 'Air Equipments', value: '#fccde5', }, // Pink
    { key: 'Aircraft', value: '#fccde5', },
    { key: 'Helicopter', value: '#fccde5', },
    { key: 'Unmanned Aerial Vehicles', value: '#fccde5', },

    { key: 'Ground Equipments', value: '#ccebc5', }, // Green
    { key: 'Armoured Fighting Vehicles', value: '#ccebc5', },
    { key: 'Armoured Personnel Carriers', value: '#ccebc5', },
    { key: 'Infantry Fighting Vehicles', value: '#ccebc5', },
    { key: 'Infantry Mobility Vehicles', value: '#ccebc5', },
    { key: 'Tanks', value: '#ccebc5', },
    { key: 'Trucks, Vehicles and Jeeps', value: '#ccebc5', },

    { key: 'Naval Equipments', value: 'cyan', }, // Cyan
    { key: 'Naval Ships', value: 'cyan', },

    { key: 'Other Equipments', value: '#fdb462', }, // Orange
    { key: 'Command Posts And Communications Stations', value: '#fdb462', },
    { key: 'Jammers And Deception Systems', value: '#fdb462', },
    { key: 'Mine-Resistant Ambush Protected', value: '#fdb462', },
    { key: 'Multiple Rocket Launchers', value: '#fdb462', },
    { key: 'Self-Propelled Anti-Aircraft Guns', value: '#fdb462', },
    { key: 'Self-Propelled Anti-Tank Missile Systems', value: '#fdb462', },
    { key: 'Self-Propelled Artillery', value: '#fdb462', },
    { key: 'Surface-To-Air Missile Systems', value: '#fdb462', },
    { key: 'Towed Artillery', value: '#fdb462', },
];

export const colorScale = d3.scaleOrdinal().domain(colorMap.map(cm => cm.key)).range(colorMap.map(cm => cm.value));
