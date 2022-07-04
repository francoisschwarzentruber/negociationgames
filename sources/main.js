var R = 0;
var C = 1;
var epsilon = 0.01;

function isNash(g, a1, a2)
{
    for(var b1 in g)
      if(g[b1][a2][0] > g[a1][a2][0])
	return false;
      
    for(var b2 in g[0])
      if(g[a1][b2][1] > g[a1][a2][1])
	return false;
      
    return true;
  
}


//IESDS([[ [2, 0], [1, 1]], [[2, 0], [3, 1]]]).survivingstrategiesR
//IESDS([[ [2, 1], [1, 1]], [[2, 0], [3, 1]]]).survivingstrategiesR
//IESDS([[ [-5, -1], [2, 2], [3, 3]], [[1, -3], [1, 2], [1, 1]], [[0, 10], [0, 0], [0, -10]]]).survivingstrategiesR
//IESDS([ [[6.01, 5.99] ,    [14.01, -0.009999999999999787] ,    [8, -2]], [   [6, 0] ,    [4, 4] ,    [4.99, 4.01]]]).survivingstrategiesR
//{ survivingstrategiesR: ....,  survivingstrategiesC: .... }
function IESDS(g)
{
  var s = { survivingstrategiesR: new Array(),  survivingstrategiesC: new Array() };
  
  for(var a1 in g)
  {
      s.survivingstrategiesR.push(true);
  }
  
  for(var a2 in g[0])
  {
      s.survivingstrategiesC.push(true);
  }
  
  
  
  
  var wecontinue = true;
  
  while(wecontinue)
  {
      wecontinue = false;
      
      for(var a1 in g)
	if(s.survivingstrategiesR[a1])
	{
	    for(var a11 in g)
	    if(s.survivingstrategiesR[a11])
	    {
	        var a1survives = false;
		for(var a2 in g[0])
		if(s.survivingstrategiesC[a2])
		    if(g[a1][a2][R] >= g[a11][a2][R])
		      a1survives = true;
	      
		if(!a1survives)
		{
		  s.survivingstrategiesR[a1] = false;
		  wecontinue = true;
		}
	    }

	}
    
      for(var a2 in g[0])
	if(s.survivingstrategiesC[a2])
	{
	    for(var a22 in g[0])
	    if(s.survivingstrategiesC[a22])
	    {
	        var a2survives = false;
		for(var a1 in g)
		if(s.survivingstrategiesR[a1])
		    if(g[a1][a2][C] >= g[a1][a22][C])
		      a2survives = true;
	      
		if(!a2survives)
		{
		  s.survivingstrategiesC[a2] = false;
		  wecontinue = true;
		}
	    }

	}

    
  }
  
  return s;
 
}




/* outcome, value*/
function maxminvalue(g, player)
{
    
    
    if(player == R)
    {
        var s = IESDS(g);
        var max = 0;
	for(var a1 in g)
	  if(s.survivingstrategiesR[a1])
	{
	     var min = Number.MAX_VALUE;
	      for(var a2 in g[0])
		if(s.survivingstrategiesC[a2])
	      {
		  min = Math.min(min, g[a1][a2][R]);
	      }
	      
	      max = Math.max(max, min);
	}
	
	return max;
      
    }
    else if(player == C)
    {
	return maxminvalue(transpose(g), 1-player);
      
    }
  
}




function minNashvalue(g, player)
{
    min = Number.MAX_VALUE;
    for(var a1 in g)
         for(var a2 in g[a1])
	      if(isNash(g, a1, a2))
	      {
		min = Math.min(min, g[a1][a2][player]);
	      }
    return min;

}





function showNashEquilibrium(g)
{
    for(var a1 in g)
         for(var a2 in g[a1])
	      if(isNash(g, a1, a2))
		    showMessage("player R plays " + actionName(R, a1) + " and player C plays " + actionName(C, a2) + " ([" + g[a1][a2][0] + ", " + g[a1][a2][1] + "]) is a NE");
}



function payoffFlip(p)
{
    return [ p[1], p[0] ];
}


function transpose(g)
{
  var ng = new Array();
  for(var i in g[0])
  {
    ng.push(new Array());
    for(var j in g)
    { 
	ng[i][j] = payoffFlip(g[j][i]);
      }
  }
  
  return ng;
  
}


//{offerer, receiver, payment, receiveraction}
function transformedGame(g, offer)
{
      var newg = copy(g);
      
      for(var a1 in g)
         for(var a2 in g[a1])
	 {
	    if( ( (offer.receiver == 0) && a1 == offer.receiveraction) || ((offer.receiver == 1) && a2 == offer.receiveraction) )
	    {
		newg[a1][a2][offer.offerer] -= offer.payment;
		newg[a1][a2][offer.receiver] += offer.payment;
	      
	    }
	   
	   
	 }
	 
	 
      return newg;
}







function copy(e)
{
  if(e instanceof Array)
  {
	var c = new Array();
	
	for(var i in e)
	{
	      c[i] = copy(e[i]);
	}
        return c;
  }
  else
    return e;
}


/*
 * */
function getBestResponses(g, playerA, actionB)
{
  if(playerA == R)
  {
      var maxR = 0;
      for(var actionR in g)
      {
	      maxR = Math.max(maxR, g[actionR][actionB][R]);
      }
      
      
      var T = new Array();
      for(var actionR in g)
      {
	      if(g[actionR][actionB][R] == maxR)
		T.push(actionR);
		
      }
      
      return T;
      
  }
  else
  {
    
    
  }
  
}





//arrayIsValueUnique([1, 3, 4, 3, 2], 3)
function arrayIsValueUnique(array, value)
{
    var c = 0;
    for(var v of array)
    {
      if(v == value)
	c++;
      
      if(c > 1)
	return false;
    }
    
    
    return (c == 1);
  
}




/*input: game, offerer, receiver
 * output: {offerer o, receiver: r, payment: m, receiveraction: action}*/
function bestoffer(g, offerer, receiver)
{
  if(offerer == R)
  {
    var bestNewValuesR = new Array(); //bestNewValuesR[actionC] will contain the current R payoff in any of the R best responses to actionC minus the payment
    var maxPayments = new Array(); // it will contain the max of all min payments: maxPayments[actionC] is the payment that R should do so that C plays actionC
    var oneBestReponseForAMinDelta = new Array();
    
    //we compute the payment for actionC
    for(var actionC in g[0])
    {	    
            var bestReponses = getBestResponses(g, R, actionC);
	    
	    var payments = new Array();
	    
	    //we look at all actions of R that are best responses to actionC
	    for(var actionR of bestReponses)
	    {
	        var maxC  = 0;
	        for(var actionC2 in g[0])
		if(actionC2 != actionC)
		{
		  maxC = Math.max(maxC, g[actionR][actionC2][C]);
		  
		}
		
		//we compute the minimum payment that R should make to make actionC best response to actionR
		var payment;
		if(maxC < g[actionR][actionC][C])
		  payment = 0;
		else
		    payment = (maxC - g[actionR][actionC][C]) + epsilon;
		
		payments.push(payment);
		console.log(payment);
	      
	    }
	    
	    //we take the max of all min payments: it is the payment that R should do so that C plays actionC
	    var maxPayment = Math.max(...payments);
	    var i = payments.indexOf(maxPayment);
	    
	    
	    var payOffRbestResponse = g[bestReponses[0]][actionC][R];
	    
	    var bestValueRforactionC = payOffRbestResponse - maxPayment;
	    
	    maxPayments.push(maxPayment);
	    bestNewValuesR.push(bestValueRforactionC);
	    oneBestReponseForAMinDelta.push(bestReponses[i]);
	    
      
    }
    
    //the best new value for R in the transformed game
    var maxBestNewValueR = Math.max(...bestNewValuesR);
    
    
    if(arrayIsValueUnique(bestNewValuesR, maxBestNewValueR))
    {
	var actionC = bestNewValuesR.indexOf(maxBestNewValueR); //B_j
	
	if(maxPayments[actionC] > 0)
	     return {offerer: offerer, receiver: receiver, payment: maxPayments[actionC], receiveraction: actionC, unique: true};
	else
	{
	      return {offerer: offerer, receiver: receiver, payment: 0, receiveraction: actionC, unique: true};
	}
	
    }
    else
    {
      //nasty behavior

      
        //we look at all actionC for which R gets the best new value (we choose one for which C will have the least new value)
        var min = Number.MAX_VALUE;
        var actionCwhereChasmin = null;
        for(var actionC in g[0])
	  if(bestNewValuesR[actionC] == maxBestNewValueR)
	  {
	    for(var actionR in getBestResponses(g, R, actionC))
	    {
		 if(min > g[actionR][actionC][C] + maxPayments[actionC])
		 {
		      min =  g[actionR][actionC][C] + maxPayments[actionC];
		      actionCwhereChasmin = actionC;
		 }

	    }	  
	  }
	  
	  
      
         return {offerer: offerer, receiver: receiver, payment: maxPayments[actionCwhereChasmin], receiveraction: actionCwhereChasmin, unique: false};
      
      
    } 
    
  }
  else
  {
    var g2 = transpose(g);
    var offer = bestoffer(g2, 1-offerer, 1-receiver);
    
    return {offerer: offerer, receiver: receiver, payment: offer.payment, receiveraction: offer.receiveraction, unique: offer.unique};
    
    
    
  }
  
  
}





function formatToAvoidUglyNumber(x)
{
    if(x == x.toFixed(0))
      return x;
    else if (x == x.toFixed(1))
      return x.toFixed(1);
    else
    return x.toFixed(2);
}



function showGame(g)
{
       var s = "[";
       for(var a1 in g)
       {
	 if(a1 != 0)
	   s+= ",\n";
	 
	 s += "[";
	 
         for(var a2 in g[a1])
	 {
		if(a2 != 0)
		     s += ",";
		s += "    [" + formatToAvoidUglyNumber(g[a1][a2][0]) + ", " + formatToAvoidUglyNumber(g[a1][a2][1]) + "]";
	 }
	   
	   s += "]";
       }
       s+= "]";
       showMessage(s);

  
}



function playerName(player)
{
    if(player == 0)
      return "R";
    else
      return "C";
}

function showOffer(o)
{
      showMessage( "The best offer of Player " + playerName(o.offerer) + " is a payment of " + 
                   o.payment + "€ to player " + playerName(o.receiver) +
		   " for playing action " + actionName(o.receiver, o.receiveraction) + ".");
      if(o.payment == 0)
      {
	    if(o.unique)
	      showMessage("(vacuous offer)");
	    else
	      showMessage("(signaling offer)");
      }

}

function execute()
{
    $("#output").val("");
    eval($("#code").val());
}




function showMessage(msg)
{
  $("#output").val($("#output").val() + "\n" + msg);
  
}





function actionName(player, action)
{
      var s = "";
      if(player == 0)
	s = "r";
      else
	s = "c";
      
      s += (action + 1);
      
      return s;
}

/*it returns the next game*/
function showOneStepNegotation(g, offerer, valuecomputationfunction)
{
  var o = bestoffer(g, offerer, 1-offerer);
  
  
  
  var g2 = transformedGame(g, o);
  showMessage("The actual game is:");
showGame(g);
  showMessage("The current value of the game for player " + playerName(offerer) + " is " + valuecomputationfunction(g, offerer) + "€.");
  
  
  if( valuecomputationfunction(g2, offerer) >= valuecomputationfunction(g, offerer))
  {
      
      showOffer(o);
      
      if(valuecomputationfunction(g2, offerer) == valuecomputationfunction(g, offerer))
	   showMessage("With this offer, the value of the game remains the same.");
      else
           showMessage("This offer improves the current value of the game for player " + playerName(offerer) + " to " + valuecomputationfunction(g2, offerer) + "€.");
      showMessage("The transformed game after that offer:");
      showGame(g2);
      showNashEquilibrium(g2);
      showMessage("");
      showMessage("");
      showMessage("");
      return {nextgame: g2, offer: o};
  }
  else
  {     showOffer(o);
        showMessage("The offer would transform the game into the following: ");
	showGame(g2);
	
	showMessage("In the new game, the value for player " + playerName(offerer) + " is " + valuecomputationfunction(g2, offerer) + ". So player " + playerName(offerer) + " passes and the game remains the same.");
        
       showMessage("");
       showMessage("");
    
	//showMessage("but pass!");
	return {nextgame: g};
    
  }
  
}

function showFullNegotiation(g, firstofferer, valuecomputationfunction)
{
        var offerer = firstofferer;
	var result = showOneStepNegotation(g, offerer, valuecomputationfunction);
	
	var gameOver = false;
	var c = 0;
	
	
	while(c < 2)
	{	    
	   offerer = 1 - offerer;
	   result = showOneStepNegotation(result.nextgame, offerer, valuecomputationfunction);
	   
	   if(result.offer == undefined)
	     c++;
	   else if (result.offer.payment == 0)
	     c++;
	   else
	     c = 0;
	   
	    
	}
	
	showMessage("completed!");
  
}


$(document).ready(function () { execute(); }     );