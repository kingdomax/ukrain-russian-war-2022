import * as d3 from 'd3';

// https://d3-graph-gallery.com/graph/custom_color.html
const colorMap = [
    { key: 'Russia', value: '#FADBD8', }, // Red
    { key: 'Ukraine', value: '#BADDF1', }, // Blue
    
    { key: 'Air Equipments', value: '#EFC9E6', }, // Pink
    { key: 'Aircraft', value: '#D5A5C4', },
    { key: 'Helicopter', value: '#D5A5C4', },
    { key: 'Unmanned Aerial Vehicles', value: '#D5A5C4', },

    { key: 'Ground Equipments', value: '#B4E0A7', }, // Green
    { key: 'Armoured Fighting Vehicles', value: '#7DC470', },
    { key: 'Armoured Personnel Carriers', value: '#7DC470', },
    { key: 'Infantry Fighting Vehicles', value: '#7DC470', },
    { key: 'Infantry Mobility Vehicles', value: '#7DC470', },
    { key: 'Tanks', value: '#7DC470', },
    { key: 'Trucks, Vehicles and Jeeps', value: '#7DC470', },

    { key: 'Naval Equipments', value: '#5B8DB8', }, // Cyan
    { key: 'Naval Ships', value: '#2A5784', },

    { key: 'Other Equipments', value: '#FFC686', }, // Orange
    { key: 'Command Posts And Communications Stations', value: '#F59D3D', },
    { key: 'Jammers And Deception Systems', value: '#F59D3D', },
    { key: 'Mine-Resistant Ambush Protected', value: '#F59D3D', },
    { key: 'Multiple Rocket Launchers', value: '#F59D3D', },
    { key: 'Self-Propelled Anti-Aircraft Guns', value: '#F59D3D', },
    { key: 'Self-Propelled Anti-Tank Missile Systems', value: '#F59D3D', },
    { key: 'Self-Propelled Artillery', value: '#F59D3D', },
    { key: 'Surface-To-Air Missile Systems', value: '#F59D3D', },
    { key: 'Towed Artillery', value: '#F59D3D', },
];

export const colorScale = d3.scaleOrdinal().domain(colorMap.map(cm => cm.key)).range(colorMap.map(cm => cm.value));
