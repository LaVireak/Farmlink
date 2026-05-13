import { Body, Controller, Post } from '@nestjs/common';
import { CreateFarmerOnboardingDto } from './dto/create-farmer.dto';
import { FarmersService } from './farmers.service';

@Controller('farmers')
export class FarmersController {
	constructor(private readonly farmersService: FarmersService) {}

	@Post('onboarding')
	submitOnboarding(@Body() dto: CreateFarmerOnboardingDto) {
		return this.farmersService.submitOnboarding(dto);
	}
}
