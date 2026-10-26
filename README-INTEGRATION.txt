Hamouda XTools Browser Simulator package
=======================================

Files:
- index.html: main site with project sidebar.
- ios-simulator/: interactive iPhone-style browser simulator.
- android-lab.html: interactive Android-style web UI, quick settings, demo apps, local ZIP archive inspector and simulated install console.

Important technical boundary:
- Android Lab is a browser simulation, not a full Android virtual machine.
- The ZIP inspector reads archive entries locally in the browser using JSZip CDN. The ZIP is not uploaded.
- The install console is explicitly a simulation and does not flash partitions, install ROMs, or boot Android.
- GitHub Pages is static hosting and cannot run AEmulator's native Android/ARM emulator engine.

Deploy: upload/merge index.html, ios-simulator/ and android-lab.html into the root of the GitHub Pages repository. Keep all ios-simulator subfolders intact.
