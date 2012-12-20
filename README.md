audiofile_sdk
=============

The SDK bits of Audiofile

Audiofile SDK will be a fully featured sdk for creating musical web apps.

Architecture
============

The Parser
----------

Takes as input any valid __music markup__ (better name to be determined) document. Outputs data object which is consumed by both the painter and the speaker.

The Painter
-----------

Takes as input a valid data object that was output by the Parser. Draws the musical notation in either canvas or svg. There will be an agnostic api which can swap canvas/svg.

The Speaker
-----------

Takes as input a valid data object that was output by the Parser. Plays the musical notation using web audio apis.
