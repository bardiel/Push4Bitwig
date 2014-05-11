// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

VolumeMode.PARAM_NAMES = 'Volume   Volume  Volume   Volume  Volume   Volume  Volume   Volume  ';


function VolumeMode (model)
{
	BaseMode.call (this, model);
	this.id = MODE_VOLUME;
}
VolumeMode.prototype = new BaseMode ();

VolumeMode.prototype.onValueKnob = function (index, value)
{
	var t = this.model.getTrack (index);
	t.volume = this.changeValue (value, t.volume);
	trackBank.getTrack (t.index).getVolume ().set (t.volume, 128);
};

VolumeMode.prototype.updateDisplay = function ()
{
	var d = push.display;
	for (var i = 0; i < 8; i++)
	{
		var t = this.model.getTrack (i);
		d.setCell (1, i, t.volumeStr, Display.FORMAT_RAW)
		 .setCell (2, i, t.volume, Display.FORMAT_VALUE);
	}
	d.setRow (0, VolumeMode.PARAM_NAMES).done (1).done (2);
};