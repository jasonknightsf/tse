<!-- Import the ThoughtSpot Visual Embed SDK -->
    <script src="https://unpkg.com/@thoughtspot/visual-embed-sdk@latest/dist/tsembed.js"></script>
    <script>
        window.addEventListener('load', function() {
            // Check if the SDK is loaded
            const tsSdk = window['@thoughtspot/visual-embed-sdk'];
            console.log('ThoughtSpot SDK:', tsSdk);

            if (!tsSdk) {
                console.error('ThoughtSpot Visual Embed SDK failed to load.');
                alert('Failed to load ThoughtSpot Visual Embed SDK. Please check your internet connection or try again later.');
                return;
            }

            try {
                const { LiveboardEmbed, AuthType, init } = tsSdk;

                // Initialize the SDK
                init({
                    thoughtSpotHost: 'https://team3.thoughtspot.cloud', // Replace with your actual ThoughtSpot host
                    authType: AuthType.None,
                });
                console.log('SDK initialized successfully.');

                // Embed the Liveboard
                const lb = new LiveboardEmbed('#container', {
                    frameParams: {
                        width: '100%',
                        height: '100%',
                    },
                    liveboardId: 'd084c256-e284-4fc4-b80c-111cb606449a', // Replace with your actual Liveboard ID
                });

                // Render the Liveboard
                lb.render();
                console.log('Liveboard rendering initiated.');

                // Optional: Handle embedding events
                lb.on('Load', () => {
                    console.log('Liveboard has been loaded successfully.');
                });

                lb.on('Error', (error) => {
                    console.error('Error occurred during embedding:', error);
                });
            } catch (error) {
                console.error('Error during initialization or embedding:', error);
            }
        });
    </script>
