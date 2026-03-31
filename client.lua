Citizen.CreateThread(function()
    ShutdownLoadingScreen()

    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(50)
    end

    ShutdownLoadingScreenNui()
end)
