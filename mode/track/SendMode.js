// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SendMode (model)
{
    AbstractTrackMode.call (this, model);
    this.id = MODE_SEND;
}
SendMode.prototype = new AbstractTrackMode ();

SendMode.prototype.onValueKnob = function (index, value)
{
    var sendIndex = this.getCurrentSendIndex ();
    this.model.getCurrentTrackBank ().changeSend (index, sendIndex, value, this.surface.getFractionValue ());
};

SendMode.prototype.onValueKnobTouch = function (index, isTouched)
{
    var sendIndex = this.getCurrentSendIndex ();
        
    if (isTouched)
    {
        if (this.surface.isDeletePressed ())
        {
            this.model.getCurrentTrackBank ().resetSend (index, sendIndex);
            return;
        }

        var fxTrackBank = this.model.getEffectTrackBank ();
        var t = this.model.getCurrentTrackBank ().getTrack (index);
        if (t.exists)
            displayNotification ("Send " + (fxTrackBank == null ? t.sends[sendIndex].name : fxTrackBank.getTrack (sendIndex).name) + ": " + t.sends[sendIndex].volumeStr);
    }
    
    this.model.getCurrentTrackBank ().touchSend (index, sendIndex, isTouched);
};

SendMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var sendIndex = this.getCurrentSendIndex ();
    var tb = this.model.getCurrentTrackBank ();
    var fxTrackBank = this.model.getEffectTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        d.setCell (0, i, t.exists ? (fxTrackBank == null ? t.sends[sendIndex].name : fxTrackBank.getTrack (sendIndex).name) : "", Display.FORMAT_RAW)
         .setCell (1, i, t.sends[sendIndex].volumeStr, Display.FORMAT_RAW)
         .setCell (2, i, t.exists ? t.sends[sendIndex].volume : "", t.exists ? Display.FORMAT_VALUE : Display.FORMAT_RAW);
    }
    d.done (0).done (1).done (2);

    this.drawRow4 ();
};

SendMode.prototype.getCurrentSendIndex = function ()
{
    return this.surface.getCurrentMode () - MODE_SEND1;
};
