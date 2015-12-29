// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ScalesMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_SCALES;
    this.isTemporary = false;
    this.scales = model.getScales ();
}
ScalesMode.prototype = new BaseMode ();

ScalesMode.prototype.onValueKnob = function (index, value)
{
    if (index != 0)
        return;
        
    var scale = this.scales.getSelectedScale ();
    scale = changeValue (value, scale, 1, this.scales.getScaleSize ());
    this.scales.setScale (scale);
    this.update ();
};

ScalesMode.prototype.onFirstRow = function (index)
{
    if (index == 0)
    {
        if (Config.isPush2)
            this.scales.nextScale ();
        else
            this.scales.prevScale ();
    }
    else if (index > 0 && index < 7)
        this.scales.setScaleOffset (index - 1);
    this.update ();
};

ScalesMode.prototype.onSecondRow = function (index)
{
    if (index == 0)
    {
        if (Config.isPush2)
            this.scales.prevScale ();
        else
            this.scales.nextScale ();
    }
    else if (index == 7)
        this.scales.toggleChromatic ();
    else
        this.scales.setScaleOffset (index + 5);
    this.update ();
};

ScalesMode.prototype.update = function ()
{
    this.surface.getActiveView ().updateNoteMapping ();
    Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
    Config.setScaleBase (Scales.BASES[this.scales.getScaleOffset ()]);
    Config.setScaleInScale (!this.scales.isChromatic ());
};

ScalesMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var scale = this.scales.getSelectedScale ();
    var offset = this.scales.getScaleOffset ();
    
    if (Config.isPush2)
    {
        var message = d.createMessage (DisplayMessage.DISPLAY_COMMAND_GRID);
        message.addByte (DisplayMessage.GRID_ELEMENT_LIST);
        for (var i = 0; i < 6; i++)
        {
            message.addString (this.scales.getName (scale + i));
            message.addBoolean (i == 0);
        }
        for (var i = 0; i < 6; i++)
            message.addOptionElement ("", Scales.BASES[6 + i], offset == 6 + i, "", Scales.BASES[i], offset == i);
        message.addOptionElement ("", this.scales.isChromatic () ? 'Chromatc' : 'In Key', this.scales.isChromatic (), "", "", false);
        message.send ();
    }
    else
    {
        d.setBlock (0, 0, Display.RIGHT_ARROW + this.scales.getName (scale))
         .clearBlock (0, 1)
         .clearBlock (0, 2)
         .setBlock (0, 3, this.scales.getRangeText ())
         .done (0);
         
        d.setBlock (1, 0, ' ' + this.scales.getName (scale + 1))
         .clearBlock (1, 1)
         .clearBlock (1, 2)
         .clearBlock (1, 3)
         .done (1);
         
        d.setCell (2, 0, ' ' + this.scales.getName (scale + 2));
        for (var i = 0; i < 6; i++)
            d.setCell (2, i + 1, '  ' + (offset == i ? Display.RIGHT_ARROW : ' ') + Scales.BASES[i]);
        d.clearCell (2, 7).done (2);
         
        d.setCell (3, 0, ' ' + this.scales.getName (scale + 3));
        for (var i = 6; i < 12; i++)
            d.setCell (3, i - 5, '  ' + (offset == i ? Display.RIGHT_ARROW : ' ') + Scales.BASES[i]);
        d.setCell (3, 7, this.scales.isChromatic () ? 'Chromatc' : 'In Key').done (3);
    }
};

ScalesMode.prototype.updateFirstRow = function ()
{
    var offset = this.scales.getScaleOffset ();
    for (var i = 0; i < 8; i++)
    {
        var isFirstOrLast = i == 0 || i == 7;
        this.surface.setButton (20 + i, i == 7 ? AbstractMode.BUTTON_COLOR_OFF : (isFirstOrLast ? PUSH_COLOR_ORANGE_LO : (offset == i - 1 ? AbstractMode.BUTTON_COLOR_HI : AbstractMode.BUTTON_COLOR_ON)));
    }
};

ScalesMode.prototype.updateSecondRow = function ()
{
    var offset = this.scales.getScaleOffset ();
    for (var i = 0; i < 8; i++)
    {
        var isFirstOrLast = i == 0 || i == 7;
        this.surface.setButton (102 + i, isFirstOrLast ? PUSH_COLOR2_AMBER : (offset == (i - 1) + 6 ? AbstractMode.BUTTON_COLOR2_HI : AbstractMode.BUTTON_COLOR2_ON));
    }
};