RL_StatoNoclip = false 
RL_Velocita = 1 
RL_CameraMode = true
RL_ListaVelocita = {
    0, 0.5, 2, 4, 6, 10, 20, 25,
}

Citizen.CreateThread(function()

    buttons = setupScaleform("instructional_buttons")

    currentSpeed = RL_ListaVelocita[RL_Velocita]

    while true do

        local sleep = 400

        if RL_StatoNoclip then
            sleep = 1

            setupScaleform("instructional_buttons")
            DrawScaleformMovieFullscreen(buttons)

            DisableControlAction(0, 30, true)
            DisableControlAction(0, 31, true)
            DisableControlAction(0, 32, true)
            DisableControlAction(0, 33, true)
            DisableControlAction(0, 34, true)
            DisableControlAction(0, 35, true)
            DisableControlAction(0, 266, true)
            DisableControlAction(0, 267, true)
            DisableControlAction(0, 268, true)
            DisableControlAction(0, 269, true)
            DisableControlAction(0, 44, true)
            DisableControlAction(0, 20, true)
            DisableControlAction(0, 74, true)
            DisableControlAction(0, 261, true)
            DisableControlAction(0, 262, true)
            DisableControlAction(0, 115, true)
            DisableControlAction(0, 99, true)
            DisableControlAction(0, 96, true)
            DisableControlAction(0, 97, true)
            DisableControlAction(0, 50, true)
            DisableControlAction(0, 14, true)
            DisableControlAction(0, 15, true)
            DisableControlAction(0, 16, true)
            DisableControlAction(0, 17, true)

            local yoff = 0.0
            local zoff = 0.0

            if IsDisabledControlPressed(1, 15) then
                if RL_Velocita ~= #RL_ListaVelocita then
                    RL_Velocita = RL_Velocita+1
                    currentSpeed = RL_ListaVelocita[RL_Velocita]
                else
                    currentSpeed = RL_ListaVelocita[1]
                    RL_Velocita = 1
                end
                setupScaleform("instructional_buttons")

                Suono()
            end

            if IsDisabledControlPressed(1, 14) then
                if RL_Velocita ~= 1 then
                    RL_Velocita = RL_Velocita-1
                    currentSpeed = RL_ListaVelocita[RL_Velocita]
                else
                    currentSpeed = RL_ListaVelocita[#RL_ListaVelocita]
                    RL_Velocita = #RL_ListaVelocita
                end
                setupScaleform("instructional_buttons")

                Suono()
            end

            if IsDisabledControlPressed(0, 32) then
                yoff = 0.5
            end
			
            if IsDisabledControlPressed(0, 33) then
                yoff = -0.5
            end
			
            if IsDisabledControlPressed(0, 34) then
                SetEntityHeading(noclipEntity, GetEntityHeading(noclipEntity)+5)
            end
			
            if IsDisabledControlPressed(0, 35) then
                SetEntityHeading(noclipEntity, GetEntityHeading(noclipEntity)-5)
            end
			
            if IsDisabledControlPressed(0, 85) then
                zoff = 0.2
            end
			
            if IsDisabledControlPressed(0, 48) then
                zoff = -0.2
            end

            if IsDisabledControlJustPressed(0, 74) then
                RL_CameraMode = not RL_CameraMode

                Suono()
            end
			
            local newPos = GetOffsetFromEntityInWorldCoords(noclipEntity, 0.0, yoff * (currentSpeed + 0.3), zoff * (currentSpeed + 0.3))
            local heading = GetEntityHeading(noclipEntity)
            SetEntityVelocity(noclipEntity, 0.0, 0.0, 0.0)
            SetEntityRotation(noclipEntity, 0.0, 0.0, 0.0, 0, false)
            if not RL_CameraMode then 
                SetEntityHeading(noclipEntity, heading) 
            else
                SetEntityHeading(noclipEntity, GetGameplayCamRelativeHeading())
            end
            SetEntityCoordsNoOffset(noclipEntity, newPos.x, newPos.y, newPos.z, RL_StatoNoclip, RL_StatoNoclip, RL_StatoNoclip)

            SetEntityLocallyVisible(noclipEntity)
        end

        Wait(sleep)
    end
end)

RegisterKeyMapping('noclip', "Noclip", 'keyboard', "INSERT")

RegisterCommand('noclip', function()
    RL_StatoNoclip = not RL_StatoNoclip

    if IsPedInAnyVehicle(PlayerPedId(), false) then
        noclipEntity = GetVehiclePedIsIn(PlayerPedId(), false)
    else
        noclipEntity = PlayerPedId()
    end

    SetEntityCollision(noclipEntity, not RL_StatoNoclip, not RL_StatoNoclip)
    FreezeEntityPosition(noclipEntity, RL_StatoNoclip)
    SetEntityInvincible(noclipEntity, RL_StatoNoclip)
    SetVehicleRadioEnabled(noclipEntity, not RL_StatoNoclip)

    SetEntityVisible(noclipEntity, not RL_StatoNoclip, 0)

    if RL_StatoNoclip then
        SetEntityAlpha(noclipEntity, 102, false)
    else
        ResetEntityAlpha(noclipEntity)
        deleteScaleform("instructional_buttons")

        if GetEntityHeightAboveGround(noclipEntity) + 1 < 5 then
            SetEntityCoordsNoOffset(noclipEntity, GetEntityCoords(noclipEntity).x, GetEntityCoords(noclipEntity).y, GetEntityCoords(noclipEntity).z - GetEntityHeightAboveGround(noclipEntity) + 1, false, false, false)
        end
    end
end)

Suono = function()
    PlaySoundFrontend(-1, "QUIT", "HUD_FRONTEND_DEFAULT_SOUNDSET")
end
