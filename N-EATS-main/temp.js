        // Renders the reservation cards in the Reserve tab (requires reservation data to show state)
        const renderReservationOptions = (meals, reservations) => {
            // Group meals by type
            const mealsByType = {
                'Breakfast': [],
                'Lunch': [],
                'Snacks': [],
                'Dinner': []
            };

            // Check if there are any meals
            if (meals.length === 0) {
                ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(type => {
                    document.getElementById(`${type}-options`).innerHTML = 
                        '<p class="text-gray-500 text-center text-sm p-4 bg-gray-50 rounded-xl">No options available</p>';
                });
                return;
            }

            const reservedMealIds = new Set(
                reservations.filter(r => r.isReserved && (isLocalMode ? true : r.reservationDate === getTodayDate()))
                           .map(r => r.mealId)
            );

            // Group meals by their type
            meals.forEach(meal => {
                if (mealsByType.hasOwnProperty(meal.type)) {
                    mealsByType[meal.type].push(meal);
                }
            });

            // Render each meal type section
            Object.entries(mealsByType).forEach(([type, typeMeals]) => {
                const containerType = type.toLowerCase();
                const container = document.getElementById(`${containerType}-options`);
                
                if (!container) return; // Skip if container doesn't exist

                container.innerHTML = '';

                if (typeMeals.length === 0) {
                    container.innerHTML = `
                        <p class="text-gray-500 text-center text-sm p-4 bg-gray-50 rounded-xl">
                            No ${type.toLowerCase()} options available
                        </p>`;
                    return;
                }

                typeMeals.forEach(meal => {
                    const isReserved = reservedMealIds.has(meal.id);
                    const buttonId = `reserve-btn-${meal.id}`;

                    const buttonClass = isReserved
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-300/50'
                        : 'bg-neats-primary hover:bg-neats-primary/80 shadow-neats-primary/50';
                    const buttonText = isReserved
                        ? 'Cancel Reservation'
                        : `Reserve (₹${meal.price})`;
                    const cardBgClass = isReserved
                        ? 'bg-neats-primary/5 border-neats-primary'
                        : 'bg-gray-50 border-neats-secondary/30';

                    const card = `
                        <div id="card-${meal.id}" 
                             class="meal-option p-4 rounded-xl transition-all duration-300 hover:shadow-md ${cardBgClass} border">
                            <div class="flex justify-between items-start mb-3">
                                <p class="text-sm font-medium text-gray-800 flex-grow">${meal.item}</p>
                                <span class="text-sm font-bold text-neats-primary bg-white px-2 py-1 rounded-lg ml-2">
                                    ₹${meal.price}
                                </span>
                            </div>
                            <button id="${buttonId}" 
                                    onclick="handleReservation('${meal.id}', '${meal.type}')"
                                    class="w-full text-white text-sm font-semibold py-2 rounded-lg transition-all duration-200 
                                           shadow-sm ${buttonClass} hover:translate-y-[-1px] active:translate-y-[1px]">
                                ${buttonText}
                            </button>
                        </div>
                    `;
                    container.innerHTML += card;
                });
            });

            // Show success message if needed
            const reserveMessage = document.getElementById('reserve-message');
            if (reserveMessage) {
                const totalReserved = Array.from(reservedMealIds).length;
                if (totalReserved > 0) {
                    reserveMessage.innerHTML = `
                        <div class="flex items-center justify-center text-neats-primary">
                            <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                            You have ${totalReserved} active reservation${totalReserved > 1 ? 's' : ''} for today
                        </div>`;
                    reserveMessage.classList.remove('hidden');
                } else {
                    reserveMessage.classList.add('hidden');
                }
            }

            // Re-initialize icons
            lucide.createIcons();
        };