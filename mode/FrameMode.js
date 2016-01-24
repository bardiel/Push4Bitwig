// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

FrameMode.ROW0          = 'Layouts:                  Panels:                                   ';
FrameMode.ROW1          = 'Arrange  Mix     Edit     Notes   Automate Device  Mixer    Inspectr';
FrameMode.ARRANGER_ROW2 = 'Arranger:                                                           ';
FrameMode.ARRANGER_ROW3 = 'ClpLnchr I/O     Markers  TimelineFXTracks Follow  TrckHght Full    ';
FrameMode.MIXER_ROW2    = 'Mixer:                                                              ';
FrameMode.MIXER_ROW3    = 'ClpLnchr I/O     CrossFde Device  Meters   Sends            Full    ';
FrameMode.EMPTY         = '                                                                    ';

FrameMode.LAYOUTS1  = [ 'Layouts',       '',    '',     'Panels', '',         '',       '',      '' ];
FrameMode.LAYOUTS2  = [ 'Arrange',       'Mix', 'Edit', 'Notes',  'Automate', 'Device', 'Mixer', 'Inspector' ];
FrameMode.ARRANGER1 = [ 'Arranger',      '',    '',     '',       '',         '',       '',      '' ];
FrameMode.ARRANGER2 = [ 'Clip Launcher', 'I/O', 'Markers', 'Timeline', 'FX Tracks', 'Follow', 'Track Height', 'Fullscreen' ];
FrameMode.MIXER1    = [ 'Mixer',         '',    '',     '',       '',         '',       '',      '' ];
FrameMode.MIXER2    = [ 'Clip Launcher', 'I/O', 'Crossfader', 'Device', 'Meters', 'Sends', '', 'Fullscreen' ];


function FrameMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_FRAME;
    this.bottomItems = [];
}
FrameMode.prototype = new BaseMode ();

FrameMode.prototype.onFirstRow = function (index) 
{
    var app = this.model.getApplication ();
    switch (index)
    {
        case 0: app.setPanelLayout ('ARRANGE'); break;
        case 1: app.setPanelLayout ('MIX'); break;
        case 2: app.setPanelLayout ('EDIT'); break;
        case 3: app.toggleNoteEditor (); break;
        case 4: app.toggleAutomationEditor (); break;
        case 5: app.toggleDevices (); break;
        case 6: app.toggleMixer (); break;
        case 7: app.toggleInspector (); break;
    }
};

FrameMode.prototype.onSecondRow = function (index)
{
    var app = this.model.getApplication ();
    if (app.isArrangeLayout ())
    {
        var arrange = this.model.getArranger ();
        switch (index)
        {
            case 0: arrange.toggleClipLauncher (); break;
            case 1: arrange.toggleIoSection (); break;
            case 2: arrange.toggleCueMarkerVisibility (); break;
            case 3: arrange.toggleTimeLine (); break;
            case 4: arrange.toggleEffectTracks (); break;
            case 5: arrange.togglePlaybackFollow (); break;
            case 6: arrange.toggleTrackRowHeight (); break;
            case 7: app.toggleFullScreen (); break;
        }
    }
    else if (app.isMixerLayout ())
    {
        var mix = this.model.getMixer ();
        switch (index)
        {
            case 0: mix.toggleClipLauncherSectionVisibility (); break;
            case 1: mix.toggleIoSectionVisibility (); break;
            case 2: mix.toggleCrossFadeSectionVisibility (); break;
            case 3: mix.toggleDeviceSectionVisibility (); break;
            case 4: mix.toggleMeterSectionVisibility (); break;
            case 5: mix.toggleSendsSectionVisibility (); break;
            case 7: app.toggleFullScreen (); break;
        }
    }
};

FrameMode.prototype.updateDisplay = function () 
{
    var app = this.model.getApplication ();
    var d = this.surface.getDisplay ();
        
    if (Config.isPush2)
    {
        var message = d.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        for (var i = 0; i < ViewSelectMode.VIEWS.length; i++)
        {
            message.addOptionElement (app.isArrangeLayout () ? FrameMode.ARRANGER1[i] : (app.isMixerLayout () ? FrameMode.MIXER1[i] : ''),
                                      app.isArrangeLayout () ? FrameMode.ARRANGER2[i] : (app.isMixerLayout () ? FrameMode.MIXER2[i] : ''),
                                      this.getSecondRowButtonState (i) > 0,
                                      FrameMode.LAYOUTS1[i], FrameMode.LAYOUTS2[i], this.getFirstRowButtonState (i));
        }
        message.send ();
    }
    else
    {
        d.setRow (0, FrameMode.ROW0)
         .setRow (1, FrameMode.ROW1)
         .setRow (2, app.isArrangeLayout () ? FrameMode.ARRANGER_ROW2 : (app.isMixerLayout () ? FrameMode.MIXER_ROW2 : FrameMode.EMPTY))
         .setRow (3, app.isArrangeLayout () ? FrameMode.ARRANGER_ROW3 : (app.isMixerLayout () ? FrameMode.MIXER_ROW3 : FrameMode.EMPTY));
    }
};

FrameMode.prototype.updateFirstRow = function ()
{
    for (var i = 0; i < 8; i++)
        this.surface.updateButton (20 + i, this.getFirstRowButtonState (i) ? AbstractMode.BUTTON_COLOR_HI : AbstractMode.BUTTON_COLOR_ON);
};

FrameMode.prototype.getFirstRowButtonState = function (index)
{
    switch (index)
    {
        case 0: 
            return this.model.getApplication ().isArrangeLayout ();
        case 1: 
            return this.model.getApplication ().isMixerLayout ();
        case 2: 
            return this.model.getApplication ().isEditLayout ();
        default:
            return false;
    }
};

FrameMode.prototype.updateSecondRow = function ()
{
    for (var i = 0; i < 8; i++) 
    {
        var state = this.getSecondRowButtonState (i);
        this.surface.updateButton (102 + i, state == 1 ? AbstractMode.BUTTON_COLOR2_HI : (state == 0 ? AbstractMode.BUTTON_COLOR2_ON : AbstractMode.BUTTON_COLOR_OFF));
    }
};

FrameMode.prototype.getSecondRowButtonState = function (index)
{
    var app = this.model.getApplication ();
    if (app.isArrangeLayout ())
    {
        var arrange = this.model.getArranger ();
        switch (index)
        {
            case 0: 
                return arrange.isClipLauncherVisible () ? 1: 0;
            case 1: 
                return arrange.isIoSectionVisible () ? 1: 0;
            case 2: 
                return arrange.areCueMarkersVisible () ? 1: 0;
            case 3: 
                return arrange.isTimelineVisible () ? 1: 0;
            case 4: 
                return arrange.areEffectTracksVisible () ? 1: 0;
            case 5: 
                return arrange.isPlaybackFollowEnabled () ? 1: 0;
            case 6: 
                return arrange.hasDoubleRowTrackHeight () ? 1: 0;
            default:
                return 0;
        }
    }

    if (app.isMixerLayout ())
    {
        var mix = this.model.getMixer ();
        switch (index)
        {
            case 0: 
                return mix.isClipLauncherSectionVisible () ? 1: 0;
            case 1: 
                return mix.isIoSectionVisible () ? 1: 0;
            case 2: 
                return mix.isCrossFadeSectionVisible () ? 1: 0;
            case 3: 
                return mix.isDeviceSectionVisible () ? 1: 0;
            case 4: 
                return mix.isMeterSectionVisible () ? 1: 0;
            case 5: 
                return mix.isSendSectionVisible () ? 1: 0;
            case 6:
                return -1;
            default:
                return 0;
        }
    }
    
    return -1;    
};
