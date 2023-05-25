/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * for property constraint Breaks
 * @author Gerd Wagner
 */
class ConstraintBreak {
  constructor(msg) {
    this.message = msg;
  }
}

class NoConstraintBreak extends ConstraintBreak {
  constructor( msg, v) {
    super( msg);
    if (v) this.checkedValue = v;
    this.message = "";
  }
}

class MandatoryValueConstraintBreak extends ConstraintBreak {
  constructor( msg) {
    super( msg);
  }
}

class RangeConstraintBreak extends ConstraintBreak {
  constructor( msg) {
    super( msg);
  }
}

class StringLengthConstraintBreak extends ConstraintBreak {
  constructor( msg) {
    super( msg);
  }
}
class UniquenessConstraintBreak extends ConstraintBreak {
  constructor (msg) {
    super( msg);
  }
}
class ReferentialIntegrityConstraintBreak extends ConstraintBreak {
  constructor (msg) {
    super( msg);
  }
}


export {
  ConstraintBreak, NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak, UniquenessConstraintBreak, ReferentialIntegrityConstraintBreak, 
};
