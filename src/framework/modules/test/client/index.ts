

setImmediate(() => {
    SetEntityInvincible(PlayerPedId(), true);
})

RegisterCommand(
    'spawn',
    (_: number, args: string[]) => {
        const vehicleName = args[0];
        const vehicleHash = GetHashKey(vehicleName);

        RequestModel(vehicleHash);

        const interval = setInterval(() => {
            if (!HasModelLoaded(vehicleHash)) return;

            const playerPed = PlayerPedId();
            const playerCoords = GetEntityCoords(playerPed);
            const playerHeading = GetEntityHeading(playerPed);

            let vehicle = GetVehiclePedIsIn(playerPed, false);
            if (vehicle !== 0) {
                DeleteEntity(vehicle);
            }

            vehicle = CreateVehicle(
                vehicleHash,
                playerCoords[0],
                playerCoords[1],
                playerCoords[2],
                playerHeading,
                true,
                false,
            );
            SetPedIntoVehicle(playerPed, vehicle, -1);
            SetVehicleRadioEnabled(vehicle, false); // Disable vehicle radio

            // Apply maximum upgrades to the vehicle
            for (let modType = 0; modType < 50; modType++) {
                const modCount = GetNumVehicleMods(vehicle, modType);
                if (modCount > 0) {
                    SetVehicleMod(vehicle, modType, modCount - 1, false);
                }
            }

            clearInterval(interval);
        }, 100);
    },
    false,
);
