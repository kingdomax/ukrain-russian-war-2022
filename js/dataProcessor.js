export const buildHierarchicalData = (russianData, ukrainianData) => {    
    const russianEquipment = {
        name: 'Russia',
        children: buildEquipmentCategories(russianData),
    };
    const ukrainianEquipment = {
        name: 'Ukraine',
        children: buildEquipmentCategories(ukrainianData),
    };

    return { name: 'root', children: [russianEquipment, ukrainianEquipment] };
};

const buildEquipmentCategories = (data) => {
    const accumulateEquipmentLoss = (equipment) => {
        return data.reduce((acc, d) => d.equipment === equipment ? acc + Number(d.losses_total) : acc, 0);
    };

    const airEquipments = {
        name: 'Air Equipments',
        children: [
            { name: 'Aircraft', value: accumulateEquipmentLoss('Aircraft') },
            { name: 'Helicopter', value: accumulateEquipmentLoss('Helicopters') },
            { name: 'Unmanned Aerial Vehicles', value: accumulateEquipmentLoss('Unmanned Aerial Vehicles') },
        ],
    };

    const groundEquipments = {
        name: 'Ground Equipments',
        children: [
            { name: 'Armoured Fighting Vehicles', value: accumulateEquipmentLoss('Armoured Fighting Vehicles') },
            { name: 'Armoured Personnel Carriers', value: accumulateEquipmentLoss('Armoured Personnel Carriers') },
            { name: 'Infantry Fighting Vehicles', value: accumulateEquipmentLoss('Infantry Fighting Vehicles') },
            { name: 'Infantry Mobility Vehicles', value: accumulateEquipmentLoss('Infantry Mobility Vehicles') },
            { name: 'Tanks', value: accumulateEquipmentLoss('Tanks') },
            { name: 'Trucks, Vehicles and Jeeps', value: accumulateEquipmentLoss('Trucks, Vehicles and Jeeps') },
        ],
    };

    const navalEquipments = {
        name: 'Naval Equipments',
        children: [
            { name: 'Naval Ships', value: accumulateEquipmentLoss('Naval Ships') },
        ],
    };

    const otherEquipments = {
        name: 'Other Equipments',
        children: [
            { name: 'Command Posts And Communications Stations', value: accumulateEquipmentLoss('Command Posts And Communications Stations') },
            { name: 'Jammers And Deception Systems', value: accumulateEquipmentLoss('Jammers And Deception Systems') },
            { name: 'Mine-Resistant Ambush Protected', value: accumulateEquipmentLoss('Mine-Resistant Ambush Protected') },
            { name: 'Multiple Rocket Launchers', value: accumulateEquipmentLoss('Multiple Rocket Launchers') },
            { name: 'Self-Propelled Anti-Aircraft Guns', value: accumulateEquipmentLoss('Self-Propelled Anti-Aircraft Guns') },
            { name: 'Self-Propelled Anti-Tank Missile Systems', value: accumulateEquipmentLoss('Self-Propelled Anti-Tank Missile Systems') },
            { name: 'Self-Propelled Artillery', value: accumulateEquipmentLoss('Self-Propelled Artillery') },
            { name: 'Surface-To-Air Missile Systems', value: accumulateEquipmentLoss('Surface-To-Air Missile Systems') },
            { name: 'Towed Artillery', value: accumulateEquipmentLoss('Towed Artillery') },
        ],
    };

    return [airEquipments, groundEquipments, navalEquipments, otherEquipments];
};

export const buildAccumulatedList = (russianData, ukrainianData) => {
    let russianEquipment = [];
    buildEquipmentCategories(russianData).forEach(category => {
        russianEquipment = [
            ...russianEquipment,
            ...category.children.map(each => {
                return {
                    name: each.name,
                    country: 'Russia',
                    category: category.name,
                    value: each.value,
                };
            }),
        ];
    });

    let ukrainianEquipment = [];
    buildEquipmentCategories(ukrainianData).forEach(category => {
        ukrainianEquipment = [
            ...ukrainianEquipment,
            ...category.children.map(each => {
                return {
                    name: each.name,
                    country: 'Ukraine',
                    category: category.name,
                    value: each.value,
                };
            }),
        ];
    });

    return [...russianEquipment, ...ukrainianEquipment];
};
